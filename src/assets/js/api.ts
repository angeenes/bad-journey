import { API_URL, BEARER_TOKEN } from "../../consts";
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


    public deleteImage(id: number): Promise<any[]> {
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

    public loadImages(tag: string | undefined | null, userId: number | null | undefined, searchString: string | undefined | null, pageSize: number | null | undefined, page = 1): Promise<any[]> {
        const filters: string[] = [];

        if (tag) {
            filters.push(`filters[tag][name][$eq]=${tag}`);
        }

        if (userId) {
            filters.push(`filters[users_permissions_user][id][$eq]=${userId}`);
        }

        if (searchString) {
            filters.push(`filters[prompt][$containsi]=${searchString}`);
        }

        const queryString = filters.length > 0 ? `?${filters.join('&')}` : '';

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${BEARER_TOKEN}`,
        };

        const url = `${this.url}/images?populate=*&sort[0]=id%3Adesc&pagination[page]=${page}&pagination[pageSize]=${pageSize}${queryString}`;

        return fetch(url, { headers })
            .then(response => response.json())
            .then(data => data.data)
            .catch(err => console.error(err));
    }

}