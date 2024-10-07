import React, { useEffect, useRef, useState } from "react";
import Post from "../Post";
import SuggestedUsers from "../SuggestedUsers";
import { toast } from "sonner";
import { reloadFeed$ } from '../reloadEvent.js';

const PostsFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [pagePosts, setPagePosts] = useState(1);
    const loaderPost = useRef(null);

    useEffect(() => {
        const reloadSubscription = reloadFeed$.subscribe(() => {
            // Aquí puedes resetear el estado de la página y recargar los posts
            setPagePosts(1);
            setPosts([]);
            loadMorePosts();
        });

        return () => reloadSubscription.unsubscribe();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserverPosts, {
            root: null,
            rootMargin: '20px',
            threshold: 1.0,
        });
        if (loaderPost.current) {
            observer.observe(loaderPost.current);
        }

        return () => {
            if (loaderPost.current) {
                observer.unobserve(loaderPost.current);
            }
        };
    }, []);

    const loadMorePosts = async () => {
        setLoadingPosts(true);
        try {
            const res = await fetch(`/api/Post/Feed?page=${pagePosts}&pageSize=10`);
            if (!res.ok) {
                toast.error("¡Ups! Ah ocurrido un error", {
                    className: "error-toast",
                    duration: 6000,
                });
                return;
            }
            const data = await res.json();
            //se asegura de no agregar post duplicados
            setPosts((prevPosts) => {
                const newPosts = data.filter((newPost) => !prevPosts.find((prevPost) => prevPost.id === newPost.id));
                return [...prevPosts, ...newPosts];
            });
        } catch (error) {
            toast.error("¡Ups! Ah ocurrido un error", {
                className: "error-toast",
                duration: 6000,
            });
        } finally {
            setLoadingPosts(false);
        }
    };

    const handleObserverPosts = (entities) => {
        const target = entities[0];
        if (target.isIntersecting) {
            setPagePosts((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        loadMorePosts();
    }, [pagePosts]);

    return (
        <>
            {!loadingPosts && posts.length === 0 && (
                <h2 className="mx-auto mt-10 font-semibold text-[#303030] dark:text-[#FEFEFE]">Sigue algunas personas para ver sus aportes ⬆️</h2>
            )}
            {posts.map((post, index) => (
                <React.Fragment key={post.id}>
                    {index === 7 && <SuggestedUsers />}
                    <Post post={post} postedBy={post.postedBy} />
                </React.Fragment>
            ))}
            {loadingPosts && <div className="text-[#7439f2] my-4 font-semibold">Cargando...</div>}
            <div ref={loaderPost} />
        </>
    );
};

export default PostsFeed;
