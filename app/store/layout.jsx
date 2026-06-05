import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Binary computers - Store Dashboard",
    description: "Binary computers - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
