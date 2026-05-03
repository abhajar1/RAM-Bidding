@IsTest(SeeAllData=true)
private class RamOffersApiTest {
    @IsTest
    static void shouldReturnSerializablePayload() {
        Test.startTest();
        List<RamOffersApi.OfferDTO> offers = RamOffersApi.getOffers();
        Test.stopTest();

        System.assertNotEquals(null, offers, 'The API should always return a list.');
        String payload = JSON.serialize(offers);
        System.assertNotEquals(null, payload, 'The payload should be serializable.');
        System.assert(payload.startsWith('['), 'Expected a JSON array payload.');
    }
}
