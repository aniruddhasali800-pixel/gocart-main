import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "Binary computers - Admin",
    description: "Binary computers - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
