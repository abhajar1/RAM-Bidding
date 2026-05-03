@RestResource(urlMapping='/ram/soumissions')
global without sharing class SoumissionController {
    private static final String HARDCODED_HOTEL_NAME = 'Hotel Atlas Sky Airport';

    @HttpGet
    global static String getSoumissions() {
        RestRequest req = RestContext.request;
        String meta = req != null && req.params != null ? req.params.get('meta') : null;
        String offerId = req != null && req.params != null ? req.params.get('offerId') : null;

        if (meta == 'conditions') {
            return JSON.serialize(getConditionsAssocieesValues());
        }

        if (String.isBlank(offerId)) {
            return JSON.serialize(new List<SoumissionHistoryItem>());
        }

        String groupKey = buildSoumissionGroupKey(offerId, HARDCODED_HOTEL_NAME);

        List<Soumission__c> rows = [
            SELECT
                Id,
                Name,
                Version__c,
                Prix_propose__c,
                Date_de_soumission__c,
                Conditions_Associ_es__c,
                Note_Interne__c,
                CreatedDate,
                CreatedBy.Name
            FROM Soumission__c
            WHERE Appel_d_offres__c = :offerId
            AND Soumission_Groupe__c = :groupKey
            AND CreatedById = :UserInfo.getUserId()
            ORDER BY Date_de_soumission__c DESC, CreatedDate DESC
            LIMIT 100
        ];

        List<SoumissionHistoryItem> out = new List<SoumissionHistoryItem>();
        for (Soumission__c row : rows) {
            SoumissionHistoryItem item = new SoumissionHistoryItem();
            item.id = row.Id;
            item.name = row.Name;
            item.versionNumber = row.Version__c != null ? Integer.valueOf(row.Version__c) : null;
            item.price = row.Prix_propose__c;
            item.submittedAt = row.Date_de_soumission__c;
            item.conditions = row.Conditions_Associ_es__c;
            item.note = row.Note_Interne__c;
            item.author = row.CreatedBy != null ? row.CreatedBy.Name : null;
            out.add(item);
        }

        return JSON.serialize(out);
    }

    private static List<PicklistValueItem> getConditionsAssocieesValues() {
        List<PicklistValueItem> values = new List<PicklistValueItem>();
        Schema.DescribeFieldResult fieldDescribe = Soumission__c.Conditions_Associ_es__c.getDescribe();

        for (Schema.PicklistEntry entry : fieldDescribe.getPicklistValues()) {
            if (!entry.isActive()) {
                continue;
            }

            PicklistValueItem item = new PicklistValueItem();
            item.label = entry.getLabel();
            item.value = entry.getValue();
            values.add(item);
        }

        return values;
    }

    
    /**
     * Créer une nouvelle soumission dans Salesforce
     * Paramètres:
     * - appelDOffresId: ID de l'appel d'offres
     * - prixPropose: Prix proposé
     * - conditionsAssociees: Conditions associées (optionnel)
     * - noteInterne: Note interne (optionnel)
     */
    @HttpPost
    global static SoumissionResponse createSoumission() {
        try {
            RestRequest req = RestContext.request;
            RestResponse res = RestContext.response;
            
            // Lire et valider le body
            String bodyString = req.requestBody.toString();
            System.debug('Request body: ' + bodyString);
            
            if (String.isBlank(bodyString)) {
                return createErrorResponse('Le corps de la requête est vide.', 'EMPTY_BODY');
            }
            
            // Parser le JSON du body
            SoumissionRequest requestBody = (SoumissionRequest) JSON.deserialize(
                bodyString,
                SoumissionRequest.class
            );
            
            String appelDOffresId = requestBody.appelDOffresId;
            Decimal prixPropose = requestBody.prixPropose;
            String conditionsAssociees = requestBody.conditionsAssociees;
            String noteInterne = requestBody.noteInterne;
            
            // Validation des paramètres requis
            if (String.isBlank(appelDOffresId)) {
                return createErrorResponse('L\'ID de l\'appel d\'offres est requis.', 'MISSING_OFFER_ID');
            }
            if (prixPropose == null || prixPropose <= 0) {
                return createErrorResponse('Le prix proposé doit être supérieur à 0.', 'INVALID_PRICE');
            }
            
            System.debug('Paramètres: appelDOffresId=' + appelDOffresId + ', prixPropose=' + prixPropose);
            
            // Vérifier l'appel d'offres existe
            List<Offer__c> offers = [
                SELECT Id, Limite_soumissions_24h__c, Hotel__c, Price__c, Plafond__c
                FROM Offer__c 
                WHERE Id = :appelDOffresId 
                LIMIT 1
            ];
            
            if (offers.isEmpty()) {
                return createErrorResponse('Appel d\'offres non trouvé avec l\'ID: ' + appelDOffresId, 'OFFER_NOT_FOUND');
            }
            
            Offer__c appelDOffres = offers[0];

            List<Hotel__c> hotels = [
                SELECT Id, Name
                FROM Hotel__c
                WHERE Name = :HARDCODED_HOTEL_NAME
                LIMIT 1
            ];

            if (hotels.isEmpty()) {
                return createErrorResponse('Hotel introuvable: ' + HARDCODED_HOTEL_NAME, 'HOTEL_NOT_FOUND');
            }

            Hotel__c hardcodedHotel = hotels[0];
            String groupKey = buildSoumissionGroupKey(appelDOffresId, hardcodedHotel.Name);
            
            // Vérifier que le prix est dans la plage autorisée
            Decimal minPrice = appelDOffres.Price__c != null ? appelDOffres.Price__c : 0;
            Decimal maxPrice = appelDOffres.Plafond__c != null ? appelDOffres.Plafond__c : 99999;
            
            if (prixPropose < minPrice || prixPropose > maxPrice) {
                return createErrorResponse(
                    'Tarif hors fourchette autorisée. Min: ' + minPrice + ', Max: ' + maxPrice,
                    'PRICE_OUT_OF_RANGE'
                );
            }
            
            // Vérifier la limite de soumissions dans les dernières 24h
            Integer soumissionsCount = [
                SELECT COUNT() 
                FROM Soumission__c 
                WHERE Soumission_Groupe__c = :groupKey 
                AND CreatedDate = LAST_N_DAYS:1
            ];
            
            Decimal submissionLimit = appelDOffres.Limite_soumissions_24h__c != null 
                ? appelDOffres.Limite_soumissions_24h__c 
                : 999;
            
            System.debug('Nombre de soumissions: ' + soumissionsCount + ', Limite: ' + submissionLimit);
            
            if (soumissionsCount >= submissionLimit) {
                return createErrorResponse(
                    'Limite de soumissions atteinte pour les dernières 24 heures (' + submissionLimit + ' max).',
                    'LIMIT_EXCEEDED'
                );
            }
            
            Integer nextVersionNumber = getNextVersionNumber(groupKey);

            // Créer la nouvelle soumission
            Soumission__c nouvelleSoumission = new Soumission__c();
            nouvelleSoumission.Appel_d_offres__c = appelDOffresId;
            nouvelleSoumission.Hotel__c = hardcodedHotel.Id;
            nouvelleSoumission.Soumission_Groupe__c = groupKey;
            nouvelleSoumission.Version__c = nextVersionNumber;
            nouvelleSoumission.Prix_propose__c = prixPropose;
            
            if (String.isNotBlank(conditionsAssociees)) {
                nouvelleSoumission.Conditions_Associ_es__c = conditionsAssociees;
            }
            if (String.isNotBlank(noteInterne)) {
                nouvelleSoumission.Note_Interne__c = noteInterne;
            }
            
            nouvelleSoumission.Date_de_soumission__c = System.now();
            
            insert nouvelleSoumission;
            
            System.debug('Soumission créée avec succès: ' + nouvelleSoumission.Id);
            
            // Retourner la réponse de succès
            SoumissionResponse response = new SoumissionResponse();
            response.success = true;
            response.message = 'Soumission créée avec succès.';
            response.soumissionId = nouvelleSoumission.Id;
            response.soumissionName = nouvelleSoumission.Name;
            response.versionNumber = nextVersionNumber;
            
            return response;
            
        } catch (JsonException e) {
            System.debug('JsonException: ' + e.getMessage());
            return createErrorResponse('Erreur de parsing JSON: ' + e.getMessage(), 'JSON_ERROR');
        } catch (QueryException e) {
            System.debug('QueryException: ' + e.getMessage());
            return createErrorResponse('Erreur de requête: ' + e.getMessage(), 'QUERY_ERROR');
        } catch (DmlException e) {
            System.debug('DmlException: ' + e.getMessage());
            return createErrorResponse('Erreur lors de la sauvegarde: ' + e.getMessage(), 'DML_ERROR');
        } catch (Exception e) {
            System.debug('Exception générale: ' + e.getMessage() + ' - Stack: ' + e.getStackTraceString());
            return createErrorResponse('Erreur: ' + e.getMessage(), 'ERROR');
        }
    }
    
    private static SoumissionResponse createErrorResponse(String message, String code) {
        SoumissionResponse response = new SoumissionResponse();
        response.success = false;
        response.message = message;
        response.code = code;
        return response;
    }

    private static String buildSoumissionGroupKey(String offerId, String hotelName) {
        return offerId + '|' + hotelName;
    }

    private static Integer getNextVersionNumber(String groupKey) {
        Integer countVersions = [
            SELECT COUNT()
            FROM Soumission__c
            WHERE Soumission_Groupe__c = :groupKey
        ];
        return countVersions + 1;
    }
    
    // DTO pour la requête
    global class SoumissionRequest {
        public String appelDOffresId;
        public Decimal prixPropose;
        public String conditionsAssociees;
        public String noteInterne;
    }
    
    // DTO pour la réponse
    global class SoumissionResponse {
        public Boolean success;
        public String message;
        public String code;
        public String soumissionId;
        public String soumissionName;
        public Integer versionNumber;
    }

    global class SoumissionHistoryItem {
        public String id;
        public String name;
        public Integer versionNumber;
        public Decimal price;
        public Datetime submittedAt;
        public String conditions;
        public String note;
        public String author;
    }

    global class PicklistValueItem {
        public String label;
        public String value;
    }
}
