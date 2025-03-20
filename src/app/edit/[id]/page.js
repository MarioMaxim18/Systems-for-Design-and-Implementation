"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProgrammingLanguage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [formData, setFormData] = useState({
        name: "",
        developer: "",
        year: "",
        description: ""
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const storedLanguages = localStorage.getItem("languages");
        if (storedLanguages) {
            const languages = JSON.parse(storedLanguages);
            const languageToEdit = languages.find(lang => lang.id === Number(id));
            if (languageToEdit) {
                setFormData(languageToEdit);
            }
        }
    }, [id]);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function validateForm() {
        let newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required.";
        } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
            newErrors.name = "Name must contain only letters.";
        }

        // Developer validation
        if (!formData.developer.trim()) {
            newErrors.developer = "Developer is required.";
        } else if (!/^[A-Za-z\s]+$/.test(formData.developer)) {
            newErrors.developer = "Developer name must contain only letters.";
        }

        // Year validation
        if (!formData.year) {
            newErrors.year = "Year is required.";
        } else if (isNaN(formData.year) || formData.year < 1900 || formData.year > new Date().getFullYear()) {
            newErrors.year = "Enter a valid year (1900 - " + new Date().getFullYear() + ").";
        }

        // Description validation
        if (!formData.description.trim()) {
            newErrors.description = "Description is required.";
        } else if (formData.description.length < 5) {
            newErrors.description = "Description must be at least 5 characters long.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }


    function handleSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) return;

        const storedLanguages = localStorage.getItem("languages");
        if (storedLanguages) {
            let languages = JSON.parse(storedLanguages);
            languages = languages.map(lang => 
                lang.id === Number(id) ? { ...formData, id: Number(id) } : lang
            );

            localStorage.setItem("languages", JSON.stringify(languages));
            router.push("/");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#131414]">
            <div className="w-[800px] flex flex-col items-start mb-4">
                <h2 className="text-xl text-white mb-2">Edit Programming Language</h2>
            </div>
            {/* Form Container */}
            <form onSubmit={handleSubmit} className="bg-[#515151] p-8 rounded-lg w-[800px] space-y-4">
                {/* Name Input */}
                <div className="flex items-center justify-between">
                    <label className="text-white text-lg">Name:</label>
                    <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="(Required: text)" 
                        className="w-2/3 px-3 py-2 rounded bg-white border-black"
                        required
                    />
                </div>
                {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

                {/* Developer Input */}
                <div className="flex items-center justify-between">
                    <label className="text-white text-lg">Developer:</label>
                    <input 
                        type="text" 
                        name="developer"
                        value={formData.developer}
                        onChange={handleChange}
                        placeholder="(Required: text)" 
                        className="w-2/3 px-3 py-2 rounded bg-white border-black"
                        required
                    />
                </div>
                {errors.developer && <p className="text-red-400 text-sm">{errors.developer}</p>}

                {/* Year Released Input */}
                <div className="flex items-center justify-between">
                    <label className="text-white text-lg">Year released:</label>
                    <input 
                        type="number" 
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        placeholder="(Required: valid year)" 
                        className="w-2/3 px-3 py-2 rounded bg-white border-black"
                        required
                    />
                </div>
                {errors.year && <p className="text-red-400 text-sm">{errors.year}</p>}

                {/* Description Input */}
                <div className="flex items-start justify-between">
                    <label className="text-white text-lg mt-2">Description:</label>
                    <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="(Required: text)" 
                        className="w-2/3 px-3 py-2 h-24 rounded bg-white border-black"
                        required
                    ></textarea>
                </div>
                {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
                
                {/* Done Button */}
                <div className="flex justify-center">
                    <button type="submit" className="px-6 py-2 mt-4 bg-white hover:bg-gray-300">Save</button>
                </div>
            </form>
        </div>
    );
}