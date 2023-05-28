import { IUser } from "../interfaces/User";

export class User {
    constructor() { }

    private login(jwt: string, user: IUser): void {
        localStorage.setItem("jwt", jwt);
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "/";
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

    public getUser(): IUser | null {
        const isConnected = this.isConnected();
        const user = localStorage.getItem("user");
        if (user && isConnected) {
            const userObj = JSON.parse(user);
            return userObj;
        } else {
            return null;
        }
    }

    public getJwt(): string | null {
        const isConnected = this.isConnected();
        const jwt = localStorage.getItem("jwt");
        if (jwt && isConnected) {
            return jwt;
        } else {
            return null;
        }
    }

    public getUsername(): IUser['username'] | null {
        const user: IUser | null = this.getUser();
        if (user) {
            return user.username;
        } else {
            return null;
        }
    }

    public getUserId(): IUser['id'] | null {
        const user: IUser | null = this.getUser();
        if (user) {
            return user.id;
        } else {
            return null;
        }
    }
}