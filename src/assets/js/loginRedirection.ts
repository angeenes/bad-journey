import { API_URL } from "../../consts";
import { OauthObject } from "../types/OauthObject";

export class Login {
  private provider: string;
  private readonly bodyEl: HTMLBodyElement | null;
  private readonly usernameEl: HTMLSpanElement | null;

  constructor(provider: string) {
    this.provider = provider;
    this.bodyEl = document.querySelector("body");
    this.usernameEl = document.querySelector("#username");
  }

  getUrlParameters(): OauthObject {
    var params = {};
    window.location.search.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      (substring: string, key: string, value: string) => {
        params[key] = value;
        return ""; // renvoie une chaîne vide pour remplacer la correspondance
      }
    );

    return params as OauthObject;
  }

  retrieveUserInfos() {
    const params: OauthObject = this.getUrlParameters();
    fetch(`${API_URL}auth/${this.provider}/callback?access_token=${params.access_token}`)
      .then((res) => {
        if (res.status !== 200) {
          res.json().then((res) => {
            // console.log('ERRORR', res);
            const message = res.error.message;
            if (this.bodyEl) {
              this.bodyEl.innerHTML = `An error occured while logging : ${message} with another provider <br>  You will be redirected in a few seconds... <br> And try to conenct with another provider`;
              setTimeout(() => {
                window.location.href = "/";
              }, 2500);
            }
          });
          throw new Error(`Couldn't login. Status: ${res.status}`);
        }
        return res;
      })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        localStorage.setItem("jwt", res.jwt);
        localStorage.setItem("user", JSON.stringify(res.user));
        if(this.usernameEl){
          this.usernameEl.innerHTML = res.user.username;
        }
        setTimeout(() => {
          window.location.href = "/account";
        }, 2500);
      })
      .catch((err) => console.log(err));
  }

  init() {
    this.retrieveUserInfos();
  }
}
