import React, { useEffect, useRef, useState } from "react";
import Product from "../Product";
import { toast } from "sonner";
import { reloadFeed$ } from '../reloadEvent.js';

const ProductsFeed = () => {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [pageProducts, setPageProducts] = useState(1);
    const loaderProduct = useRef(null);

    useEffect(() => {
        const reloadSubscription = reloadFeed$.subscribe(() => {
            // Aquí puedes resetear el estado de la página y recargar los posts
            setPageProducts(1);
            setProducts([]);
            loadMoreProducts();
        });

        return () => reloadSubscription.unsubscribe();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserverProducts, {
            root: null,
            rootMargin: '20px',
            threshold: 1.0,
        });
        if (loaderProduct.current) {
            observer.observe(loaderProduct.current);
        }

        return () => {
            if (loaderProduct.current) {
                observer.unobserve(loaderProduct.current);
            }
        };
    }, []);

    useEffect(() => {
        loadMoreProducts();
    }, [pageProducts]);

    const loadMoreProducts = async () => {
        setLoadingProducts(true);
        try {
            const res = await fetch(`/api/Product/Feed?page=${pageProducts}&pageSize=10`);
            if (!res.ok) {
                toast.error("¡Ups! Ah ocurrido un error", {
                    className: "error-toast",
                    duration: 6000,
                });
                return;
            }
            const data = await res.json();
            //se asegura de no agregar productos duplicados
            setProducts((prevProducts) => {
                const newProducts = data.filter((newProduct) => !prevProducts.find((prevProduct) => prevProduct.id === newProduct.id));
                return [...prevProducts, ...newProducts];
            });
        } catch (error) {
            toast.error("¡Ups! Ah ocurrido un error", {
                className: "error-toast",
                duration: 6000,
            });
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleObserverProducts = (entities) => {
        const target = entities[0];
        if (target.isIntersecting) {
            setPageProducts((prevPage) => prevPage + 1);
        }
    };

    return (
        <>
            {!loadingProducts && products.length === 0 && (
                <h2 className="mx-auto mt-10 font-semibold text-[#303030] dark:text-[#FEFEFE]">Sigue algunas personas para ver sus productos ⬆️</h2>
            )}
            {products.map((product) => (
                <Product key={product.id} produ={product} postedBy={product.postedBy} />
            ))}
            {loadingProducts && <div className="text-[#7439f2] my-4 font-semibold">Cargando...</div>}
            <div ref={loaderProduct} />
        </>
    );
};

export default ProductsFeed;
