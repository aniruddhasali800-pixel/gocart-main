'use client'
import { assets } from "@/assets/assets"
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

export default function CreateStore() {
    const router = useRouter()

    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const [storeInfo, setStoreInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        phone: "",
        gstNumber: "",
        address: "",
        image: ""
    })

    const onChangeHandler = (e) => {
        setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
    }

    const fetchSellerStatus = async () => {
        try {
            const res = await api.getMyStore();
            if (res.success && res.store) {
                setAlreadySubmitted(true);
                setStatus(res.store.status);
                if (res.store.status === 'pending') {
                    setMessage("Your store application is pending approval.");
                } else if (res.store.status === 'approved') {
                    setMessage("Your store is approved!");
                    setTimeout(() => router.push('/store'), 3000);
                } else {
                    setMessage("Your store application was rejected.");
                }
            }
        } catch (error) {
            // No store found, just stop loading to show form
        } finally {
            setLoading(false);
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            let logoUrl = "";
            if (storeInfo.image) {
                const uploadRes = await api.uploadImage(storeInfo.image);
                logoUrl = uploadRes.url;
            }

            const res = await api.createStore({
                name: storeInfo.name,
                username: storeInfo.username,
                description: storeInfo.description,
                email: storeInfo.email,
                contact: storeInfo.contact,
                phone: storeInfo.phone,
                gstNumber: storeInfo.gstNumber,
                address: storeInfo.address,
                logo: logoUrl
            });

            if (res.success) {
                setAlreadySubmitted(true);
                setStatus("pending");
                setMessage("Store submitted successfully! Awaiting approval.");
            }
        } catch (error) {
            throw new Error(error.message || "Failed to submit store");
        }
    }

    useEffect(() => {
        fetchSellerStatus()
    }, [])

    return !loading ? (
        <>
            {!alreadySubmitted ? (
                <div className="mx-6 min-h-[70vh] my-16">
                    <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Submitting data..." })} className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500">
                        {/* Title */}
                        <div>
                            <h1 className="text-3xl ">Add Your <span className="text-slate-800 font-medium">Store</span></h1>
                            <p className="max-w-lg">To become a seller on GoCart, submit your store details for review. Your store will be activated after admin verification.</p>
                        </div>

                        <label className="mt-10 cursor-pointer">
                            Store Logo
                            <Image src={storeInfo.image ? URL.createObjectURL(storeInfo.image) : assets.upload_area} className="rounded-lg mt-2 h-16 w-auto" alt="" width={150} height={100} />
                            <input type="file" accept="image/*" onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })} hidden />
                        </label>

                        <p>Username</p>
                        <input name="username" onChange={onChangeHandler} value={storeInfo.username} type="text" placeholder="Enter your store username" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Name</p>
                        <input name="name" onChange={onChangeHandler} value={storeInfo.name} type="text" placeholder="Enter your store name" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Description</p>
                        <textarea name="description" onChange={onChangeHandler} value={storeInfo.description} rows={5} placeholder="Enter your store description" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none" />

                        <p>Email</p>
                        <input name="email" onChange={onChangeHandler} value={storeInfo.email} type="email" placeholder="Enter your store email" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Contact / Alternate Phone</p>
                        <input name="contact" onChange={onChangeHandler} value={storeInfo.contact} type="text" placeholder="Enter alternate contact" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Phone Number</p>
                        <input name="phone" required onChange={onChangeHandler} value={storeInfo.phone} type="text" placeholder="Enter your phone number" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>GST Number</p>
                        <input name="gstNumber" required onChange={onChangeHandler} value={storeInfo.gstNumber} type="text" placeholder="Enter your GST Number" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Address</p>
                        <textarea name="address" required onChange={onChangeHandler} value={storeInfo.address} rows={5} placeholder="Enter your store address" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none" />

                        <button className="bg-slate-800 text-white px-12 py-2 rounded mt-10 mb-40 active:scale-95 hover:bg-slate-900 transition ">Submit</button>
                    </form>
                </div>
            ) : (
                <div className="min-h-[80vh] flex flex-col items-center justify-center">
                    <p className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl">{message}</p>
                    {status === "approved" && <p className="mt-5 text-slate-400">redirecting to dashboard in <span className="font-semibold">5 seconds</span></p>}
                </div>
            )}
        </>
    ) : (<Loading />)
}