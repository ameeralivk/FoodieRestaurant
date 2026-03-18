


export interface IAIService{
    getReply(prompt: string,restaurantId:string): Promise<string>
}