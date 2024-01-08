
export enum UserTypesEnum {
    COUNTRY_ADMIN = "COUNTRY_ADMIN",
    COUNTRY_USER = "COUNTRY_USER",
    MASTER_ADMIN = "MASTER_ADMIN",
    EXTERNAL = "EXTERNAL"
}
export const UserTypes =  [
    {name: "Country Admin", code: UserTypesEnum.COUNTRY_ADMIN},
    {name: "Country User", code: UserTypesEnum.COUNTRY_USER},
    {name: "Master Admin", code: UserTypesEnum.MASTER_ADMIN},
    {name: "External", code: UserTypesEnum.EXTERNAL}
]