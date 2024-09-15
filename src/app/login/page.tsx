import { validateRequest } from "@/lib/auth";
import LoginForm from "../_ui/login-form";
import { redirect } from "next/navigation";

export default async function Page() {
    const { user } = await validateRequest();

    if (user?.email) {
        redirect("/profile");
    }

    return (
        <table className="h-screen w-full align-middle">
            <tbody>
                <tr>
                    <td>
                        <LoginForm />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
