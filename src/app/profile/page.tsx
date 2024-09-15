
import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logoutUser } from "../action";

export default async function Page() {
    const { user } = await validateRequest();
    if (!user) {
        redirect("/login");
    }
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <div>
                hello&nbsp; <span className="text-blue-500">{user.email}</span>
            </div>
            <form action={logoutUser}>
                <Button variant={`destructive`} type="submit" className="mt-5">
                    Logout
                </Button>
            </form>
        </div>
    );
}
