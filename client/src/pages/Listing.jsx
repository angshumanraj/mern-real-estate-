import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Swiper,SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import { Navigation } from "swiper/modules";

export const Listing = () => {
    SwiperCore.use(Navigation)
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const { id } = useParams(); // Access the 'id' parameter from the URL

    useEffect(() => {
        const fetchingListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${id}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data) 
                setLoading(false)
                setError(false)
            } catch (error) {
                setError(true);
                setLoading(false);
            } 
        };
        fetchingListing();
    }, [id]);   
    console.log(loading)
    return (
        <main>
            {
                loading && <p className="text-2xl text-center my-7">Loading...</p>
            }
            {
                error && <p className="text-red-600 text-2xl text-center my-7">Something went Wrong...</p>
            }
            {listing && !loading && !error &&(
                    <>
                        <Swiper navigation>
                            {
                                listing.imgUrls.map((url)=>(
                                    <SwiperSlide key={url}>
                                    <div className="h-[350px]" style={{ background: `url(${url}) center no-repeat`, backgroundSize:'cover' }}></div>

                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </>
                
            )}
        </main>
    );
};
