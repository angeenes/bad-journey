import { IUser } from "../interfaces/User";

export class User {
    constructor(){

    }

    private isConnected(): boolean {
        const jwt = localStorage.getItem("jwt");
        const user = localStorage.getItem("user");
        return jwt && user ? true : false;
    }

    private logout(): void {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        window.location.href = "/";
    }

    private getUser(): IUser | null {
        const isConnected = this.isConnected();
        const user = localStorage.getItem("user");
        if (user && isConnected) {
            const userObj = JSON.parse(user);
            return userObj;
        } else {
            return null;
        }
    }

    private getUsername(): IUser['username'] | null {
        const user: IUser | null = this.getUser();
        if (user) {
            return user.username;
        } else {
            return null;
        }
    }
}