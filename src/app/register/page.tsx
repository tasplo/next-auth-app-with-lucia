import { redirect } from "next/navigation";
import RegisterForm from "../_ui/register-form";
import { validateRequest } from "@/lib/auth";

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
                        <RegisterForm />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
