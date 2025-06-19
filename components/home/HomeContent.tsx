"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  getFirestore,
} from "firebase/firestore";
import { app } from "@/lib/firebase";
import Header from "./Header";
import Slider from "./Slider";
import Categories from "./Categories";
import ProductList from "../products/ProductList";
import LoadingSpinner from "../ui/loading-spinner";

export default function HomeContent() {
  const [sliderList, setSliderList] = useState<any[]>([]);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [latestItemList, setLatestItemList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sliders
        const slidersSnapshot = await getDocs(collection(db, "Sliders"));
        const sliders = slidersSnapshot.docs.map((doc) => doc.data());
        setSliderList(sliders);

        // Fetch categories
        const categoriesSnapshot = await getDocs(collection(db, "Category"));
        const categories = categoriesSnapshot.docs.map((doc) => doc.data());
        setCategoryList(categories);

        // Fetch latest items
        const postsQuery = query(
          collection(db, "UserPost"),
          where("isAuthorized", "==", true),
          orderBy("createdAt", "desc")
        );
        const postsSnapshot = await getDocs(postsQuery);
        const items = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLatestItemList(items);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [db]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <Header />
      <Slider sliderList={sliderList} />
      <Categories categoryList={categoryList} />

      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-6 gradient-text">
          Artículos Recientes
        </h2>
        {latestItemList.length > 0 ? (
          <ProductList products={latestItemList} />
        ) : (
          <div className="text-center py-16 glass-effect rounded-2xl">
            <p className="text-xl text-gray-500">
              ¡Aún no se ha subido ningún artículo!
            </p>
            <p className="text-gray-400 mt-2">
              Sé el primero en publicar algo increíble
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
