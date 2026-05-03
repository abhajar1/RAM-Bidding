@RestResource(urlMapping='/ram/offers')
global with sharing class RamOffersApi {
    private static final Set<String> VALID_STATUSES = new Set<String>{
        'Publi\u00E9',
        'Soumis',
        'Publie',
        'Published'
    };

    @HttpGet
    global static List<OfferDTO> getOffers() {
        List<Offer__c> rows = [
            SELECT
                Id,
                Name,
                Status__c,
                Price__c,
                Escale_concernee__c,
                Type_de_produit__c,
                Date_de_debut__c,
                Date_de_fin__c,
                Message_accompagnant_l_invitation__c,
                Plafond__c,
                Limite_soumissions_24h__c,
                Submitted_At__c,
                Engagement_minimal_d_inventaire_hotel__c,
                Volume_previsionnel_nuitees_mois__c,
                Ponderation_prix__c,
                Ponderation_SLA__c,
                Ponderation_qualite__c
            FROM Offer__c
            WHERE Status__c IN :VALID_STATUSES
            ORDER BY Date_de_fin__c DESC NULLS LAST
        ];

        List<OfferDTO> out = new List<OfferDTO>();
        for (Offer__c row : rows) {
            OfferDTO dto = new OfferDTO();
            dto.id = row.Id;
            dto.reference = row.Name;
            dto.status = 'active';
            dto.escale = row.Escale_concernee__c;
            dto.productType = row.Type_de_produit__c;
            dto.startDate = row.Date_de_debut__c;
            dto.endDate = row.Date_de_fin__c;
            dto.priceFloor = row.Price__c;
            dto.priceCeiling = row.Plafond__c;
            dto.submissionLimit24h = row.Limite_soumissions_24h__c;
            dto.submittedAt = row.Submitted_At__c;
            dto.minInventoryCommitment = row.Engagement_minimal_d_inventaire_hotel__c;
            dto.volumeForecast = row.Volume_previsionnel_nuitees_mois__c;
            dto.weightPrice = row.Ponderation_prix__c;
            dto.weightSla = row.Ponderation_SLA__c;
            dto.weightQuality = row.Ponderation_qualite__c;
            dto.message = row.Message_accompagnant_l_invitation__c;
            out.add(dto);
        }
        return out;
    }

    global class OfferDTO {
        public Id id;
        public String reference;
        public String status;
        public String escale;
        public String productType;
        public Date startDate;
        public Date endDate;
        public Decimal priceFloor;
        public Decimal priceCeiling;
        public Decimal submissionLimit24h;
        public Datetime submittedAt;
        public Decimal minInventoryCommitment;
        public Decimal volumeForecast;
        public Decimal weightPrice;
        public Decimal weightSla;
        public Decimal weightQuality;
        public String message;
    }
}