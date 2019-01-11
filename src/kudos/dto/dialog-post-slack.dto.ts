export class DialogPostSlackDto {
    readonly payload: string;
}

export class PayloadClass {
    readonly user: {id: string, name: string}
    readonly submission: {kudos_given: string, description: string}
    readonly response_url: string
    readonly token: string

}
