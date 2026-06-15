'use client'
import api from "@/lib/api"
import Loading from "@/components/Loading"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { SaveIcon, UploadCloudIcon, PlusIcon, TrashIcon, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

export default function CustomizePage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [logoPreview, setLogoPreview] = useState('/logo.png')
    
    const [formData, setFormData] = useState({
        logo: '/logo.png',
        contactInfo: {
            phone: '',
            email: '',
            address: ''
        },
        socialMedia: {
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: ''
        },
        sliders: []
    })

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.getCustomize()
                if (res.success && res.settings) {
                    setFormData(res.settings)
                    setLogoPreview(res.settings.logo || '/logo.png')
                }
            } catch (error) {
                toast.error('Failed to load settings')
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }))
    }

    const handleSliderChange = (index, field, value) => {
        const newSliders = [...formData.sliders]
        newSliders[index][field] = value
        setFormData(prev => ({ ...prev, sliders: newSliders }))
    }

    const addSlider = () => {
        setFormData(prev => ({
            ...prev,
            sliders: [...prev.sliders, {
                image: '',
                badgeText: 'NEWS',
                badgeSub: 'Free Shipping!',
                title: 'New Gadgets',
                priceText: 'Starts from',
                price: '$4.90',
                buttonText: 'LEARN MORE',
                link: '/shop'
            }]
        }))
    }

    const removeSlider = (index) => {
        const newSliders = [...formData.sliders]
        newSliders.splice(index, 1)
        setFormData(prev => ({ ...prev, sliders: newSliders }))
    }

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        
        try {
            toast.loading("Uploading logo...", { id: "upload" })
            const res = await api.uploadImage(file)
            if (res.success) {
                setFormData(prev => ({ ...prev, logo: res.url }))
                setLogoPreview(res.url)
                toast.success("Logo uploaded", { id: "upload" })
            }
        } catch (error) {
            toast.error("Upload failed", { id: "upload" })
        }
    }

    const handleSliderImageUpload = async (e, index) => {
        const file = e.target.files[0]
        if (!file) return
        
        try {
            toast.loading("Uploading image...", { id: `upload-${index}` })
            const res = await api.uploadImage(file)
            if (res.success) {
                const newSliders = [...formData.sliders]
                newSliders[index].image = res.url
                setFormData(prev => ({ ...prev, sliders: newSliders }))
                toast.success("Image uploaded", { id: `upload-${index}` })
            }
        } catch (error) {
            toast.error("Upload failed", { id: `upload-${index}` })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await api.updateCustomize(formData)
            if (res.success) {
                toast.success("Website settings updated successfully!")
            }
        } catch (error) {
            toast.error(error.message || "Failed to update settings")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <Loading />

    return (
        <div className="text-slate-600 mb-10 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl text-slate-800 font-semibold">Customize Website</h1>
                    <p className="text-sm text-slate-500">Update logo, sliders, and contact details</p>
                </div>
                <button 
                    onClick={handleSubmit} 
                    disabled={saving}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition disabled:opacity-70"
                >
                    {saving ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <SaveIcon size={18} />}
                    Save Changes
                </button>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
                
                {/* Logo Section */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Website Logo</h2>
                    <div className="flex items-center gap-6">
                        <div className="w-48 h-24 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 p-2 relative">
                            {logoPreview ? (
                                <Image src={logoPreview} alt="Logo Preview" width={160} height={80} className="object-contain max-h-full" />
                            ) : (
                                <ImageIcon className="text-slate-400" size={40} />
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-2">Upload a transparent PNG image. Any size is supported.</p>
                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition border border-slate-300 text-sm font-medium">
                                <UploadCloudIcon size={16} />
                                Choose File
                                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                            <input type="text" value={formData.contactInfo?.phone || ''} onChange={(e) => handleChange('contactInfo', 'phone', e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input type="email" value={formData.contactInfo?.email || ''} onChange={(e) => handleChange('contactInfo', 'email', e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Office Address</label>
                            <textarea rows={2} value={formData.contactInfo?.address || ''} onChange={(e) => handleChange('contactInfo', 'address', e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Social Media Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Facebook URL</label>
                            <input type="url" value={formData.socialMedia?.facebook || ''} onChange={(e) => handleChange('socialMedia', 'facebook', e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Instagram URL</label>
                            <input type="url" value={formData.socialMedia?.instagram || ''} onChange={(e) => handleChange('socialMedia', 'instagram', e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Twitter (X) URL</label>
                            <input type="url" value={formData.socialMedia?.twitter || ''} onChange={(e) => handleChange('socialMedia', 'twitter', e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
                            <input type="url" value={formData.socialMedia?.linkedin || ''} onChange={(e) => handleChange('socialMedia', 'linkedin', e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                    </div>
                </div>

                {/* Hero Sliders */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between border-b pb-2 mb-4">
                        <h2 className="text-lg font-semibold text-slate-800">Hero Sliders</h2>
                        <button type="button" onClick={addSlider} className="text-sm flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition font-medium">
                            <PlusIcon size={16} /> Add Slider
                        </button>
                    </div>

                    {formData.sliders?.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                            No sliders added yet. Click "Add Slider" to create one.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {formData.sliders?.map((slider, index) => (
                                <div key={index} className="p-5 border border-slate-200 rounded-lg bg-slate-50 relative group">
                                    <button 
                                        type="button" 
                                        onClick={() => removeSlider(index)} 
                                        className="absolute top-4 right-4 text-rose-500 hover:bg-rose-100 p-1.5 rounded-md transition opacity-0 group-hover:opacity-100"
                                    >
                                        <TrashIcon size={16} />
                                    </button>
                                    
                                    <h3 className="font-medium text-slate-700 mb-4">Slider #{index + 1}</h3>
                                    
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Image Upload */}
                                        <div className="w-full lg:w-1/3">
                                            <div className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center border border-slate-300 relative overflow-hidden mb-2">
                                                {slider.image ? (
                                                    <Image src={slider.image} alt={`Slider ${index}`} fill className="object-cover" />
                                                ) : (
                                                    <ImageIcon className="text-slate-400" size={40} />
                                                )}
                                            </div>
                                            <label className="cursor-pointer flex items-center justify-center gap-2 w-full px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg transition border border-slate-300 text-sm font-medium">
                                                <UploadCloudIcon size={16} />
                                                Upload Image
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSliderImageUpload(e, index)} />
                                            </label>
                                        </div>
                                        
                                        {/* Slider Fields */}
                                        <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Main Title</label>
                                                <input type="text" value={slider.title} onChange={(e) => handleSliderChange(index, 'title', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Badge Text (e.g., NEWS)</label>
                                                <input type="text" value={slider.badgeText} onChange={(e) => handleSliderChange(index, 'badgeText', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Badge Subtext</label>
                                                <input type="text" value={slider.badgeSub} onChange={(e) => handleSliderChange(index, 'badgeSub', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Price Prefix (e.g., Starts from)</label>
                                                <input type="text" value={slider.priceText} onChange={(e) => handleSliderChange(index, 'priceText', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Price Value</label>
                                                <input type="text" value={slider.price} onChange={(e) => handleSliderChange(index, 'price', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Button Text</label>
                                                <input type="text" value={slider.buttonText} onChange={(e) => handleSliderChange(index, 'buttonText', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Button Link</label>
                                                <input type="text" value={slider.link} onChange={(e) => handleSliderChange(index, 'link', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </form>
        </div>
    )
}
