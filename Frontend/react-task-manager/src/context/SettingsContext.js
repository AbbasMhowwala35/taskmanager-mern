import React, { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

const defaultHeroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60",
    title: "Elevate Your Digital Workspace",
    subtitle: "Discover a curated collection of minimalist desk peripherals, premium audio equipment, and smart wearables built for the modern creator.",
    ctaText: "Shop the Collection",
    ctaLink: "#featured-products"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=60",
    title: "Precision & Performance",
    subtitle: "Experience tactile satisfaction and responsive control with hot-swappable custom layout mechanical keyboards.",
    ctaText: "Explore Keyboards",
    ctaLink: "#featured-products"
  }
];

const defaultLogoSettings = {
  prefix: "Vibe",
  suffix: "Store"
};

const defaultSocialLinks = {
  facebook: "https://facebook.com",
  twitter: "https://twitter.com",
  instagram: "https://instagram.com"
};

const defaultCategories = ["Audio", "Peripherals", "Office", "Wearables", "Lifestyle"];

export const SettingsProvider = ({ children }) => {
  const [heroSlides, setHeroSlides] = useState(() => {
    const saved = localStorage.getItem("hero_slides");
    return saved ? JSON.parse(saved) : defaultHeroSlides;
  });

  const [logoSettings, setLogoSettings] = useState(() => {
    const saved = localStorage.getItem("logo_settings");
    return saved ? JSON.parse(saved) : defaultLogoSettings;
  });

  const [socialLinks, setSocialLinks] = useState(() => {
    const saved = localStorage.getItem("social_links");
    return saved ? JSON.parse(saved) : defaultSocialLinks;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("store_categories");
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  useEffect(() => {
    localStorage.setItem("hero_slides", JSON.stringify(heroSlides));
  }, [heroSlides]);

  useEffect(() => {
    localStorage.setItem("logo_settings", JSON.stringify(logoSettings));
  }, [logoSettings]);

  useEffect(() => {
    localStorage.setItem("social_links", JSON.stringify(socialLinks));
  }, [socialLinks]);

  useEffect(() => {
    localStorage.setItem("store_categories", JSON.stringify(categories));
  }, [categories]);

  // Slide CRUD Actions
  const addHeroSlide = (slide) => {
    const newSlide = {
      ...slide,
      id: heroSlides.length > 0 ? Math.max(...heroSlides.map(s => s.id)) + 1 : 1
    };
    setHeroSlides((prev) => [...prev, newSlide]);
  };

  const updateHeroSlide = (updatedSlide) => {
    setHeroSlides((prev) =>
      prev.map((s) => (s.id === updatedSlide.id ? updatedSlide : s))
    );
  };

  const deleteHeroSlide = (id) => {
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  };

  // Category Actions
  const addCategory = (category) => {
    if (category.trim() && !categories.includes(category.trim())) {
      setCategories((prev) => [...prev, category.trim()]);
    }
  };

  const deleteCategory = (categoryName) => {
    setCategories((prev) => prev.filter((cat) => cat !== categoryName));
  };

  return (
    <SettingsContext.Provider
      value={{
        heroSlides,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        logoSettings,
        setLogoSettings,
        socialLinks,
        setSocialLinks,
        categories,
        addCategory,
        deleteCategory
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
