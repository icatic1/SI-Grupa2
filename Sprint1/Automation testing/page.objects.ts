import { HomePage } from "./pages/home.page";
import { AdminPage } from "./pages/admin.page";
import { LoginPage } from "./pages/login.page";
import { AddUserPage } from "./pages/adduser.page";
import { UserPage } from "./pages/user.page";

export class GetPageLocators {

    constructor() {
    }

    public getHomePage(){
        return new HomePage();
    }

    public getAdminPage(){
        return new AdminPage();
    }

    public getLoginPage(){
        return new LoginPage();
    }

    public getAddUserPage() {
        return new AddUserPage();
    }

    public getUserPage() {
        return new UserPage();
    }

}
