export { CommunicationSendEmailProfile } from "./types/communication/send-email";
export { VcsUserReposProfile } from "./types/vcs/user-repos";
export { AddressGeocodingProfile } from "./types/address/geocoding";
export declare const SuperfaceClient: new () => import("@superfaceai/one-sdk/dist/client/client").TypedSuperfaceClient<{
    "address/geocoding": {
        Geocode: [import("./types/address/geocoding").AddressGeocodingGeocodeInput, import("./types/address/geocoding").AddressGeocodingGeocodeResult];
        ReverseGeocode: [import("./types/address/geocoding").AddressGeocodingReverseGeocodeInput, import("./types/address/geocoding").AddressGeocodingReverseGeocodeResult];
    };
    "vcs/user-repos": {
        UserRepos: [import("./types/vcs/user-repos").VcsUserReposUserReposInput, import("./types/vcs/user-repos").VcsUserReposUserReposResult];
    };
    "communication/send-email": {
        SendEmail: [import("./types/communication/send-email").CommunicationSendEmailSendEmailInput, import("./types/communication/send-email").CommunicationSendEmailSendEmailResult];
    };
}>;
export declare type SuperfaceClient = InstanceType<typeof SuperfaceClient>;
