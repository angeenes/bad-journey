import { API_URL } from "../../consts";
import { User } from "@classes/user";

export class Api {

    private readonly url: string;

    constructor() {
        this.url = API_URL;
    }

    public addOneViewToAnImage(imageId: string, viewsNumber: number): Promise<any> {

        const options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: `{"data":{"views":"${viewsNumber + 1}"}}`
        };

        return fetch(`${this.url}/images/${imageId}`, options)
            .then(response => response.json())
            .catch(err => console.error(err));
    }


    public deleteImageApi(id: number): Promise<any[]> {
        const token = User.prototype.getJwt();

        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };

        return fetch(`${this.url}/images/${id}`, {
            method: 'DELETE',
            headers,
        })
            .then(response => response.json())
            .then(data => data.data)
            .catch(err => console.error(err));
    }

}