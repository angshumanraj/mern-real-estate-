import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSelector } from 'react-redux';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import { Navigation } from "swiper/modules";
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import { Contact } from "../components/Contact";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { useLocation } from 'react-router-dom';
export const Listing = () => {
    
    SwiperCore.use(Navigation)
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(true);
    const { id } = useParams();
    const location=useLocation();
    const formData=location.state;
    const{latitude,longitude}=formData
    console.log("this location in listing page",latitude)  
    const { currentUser } = useSelector((state) => state.user);
    useEffect(() => {
        console.log(id)
        const fetchingListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${id}`);

                const data = await res.json();
                console.log(data)
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
   
    

    return (
      <main>
          {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
          {error && (
              <p className='text-center my-7 text-2xl'>Something went wrong!</p>
          )}
          {listing && !loading && !error && (
              <div>
                  <Swiper navigation>
                      {listing.imgUrls.map((url) => (
                          <SwiperSlide key={url}>
                              <div
                                  className='h-[400px]'
                                  style={{
                                      background: `url(${url}) center no-repeat`,
                                      backgroundSize: 'cover',
                                  }}
                              ></div>
                          </SwiperSlide>
                      ))}
                  </Swiper>
                  <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                      <FaShare
                          className='text-slate-500'
                          onClick={() => {
                              navigator.clipboard.writeText(window.location.href);
                              setCopied(true);
                              setTimeout(() => {
                                  setCopied(false);
                              }, 2000);
                          }}
                      />
                  </div>
                  {copied && (
                      <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                          Link copied!
                      </p>
                  )}
                  <div className='bg-white rounded-lg py-8'>
                      <div className='max-w-4xl mx-auto px-6'>
                          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                              <div>
                                  <p className='text-2xl font-semibold'>
                                      {listing.name} - ${' '}
                                      {listing.offer
                                          ? listing.discountPrice.toLocaleString('en-US')
                                          : listing.regularPrice.toLocaleString('en-US')}
                                      {listing.type === 'rent' && ' / month'}
                                  </p>
                                  <p className='flex items-center mt-6 gap-2 text-slate-600 text-sm'>
                                      <FaMapMarkerAlt className='text-green-700' />
                                      {listing.address}
                                  </p>
                                  <div className='flex gap-4 mt-4'>
                                      <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                          {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                                      </p>
                                      {listing.offer && (
                                          <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                              ${+listing.regularPrice - +listing.discountPrice} OFF
                                          </p>
                                      )}
                                  </div>
                                  <p className='text-slate-800 mt-4'>
                                      <span className='font-semibold text-black'>Description - </span>
                                      {listing.description}
                                  </p>
                                  <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6 mt-4'>
                                      <li className='flex items-center gap-1 whitespace-nowrap '>
                                          <FaBed className='text-lg' />
                                          {listing.bedrooms > 1
                                              ? `${listing.bedrooms} beds `
                                              : `${listing.bedrooms} bed `}
                                      </li>
                                      <li className='flex items-center gap-1 whitespace-nowrap '>
                                          <FaBath className='text-lg' />
                                          {listing.bathrooms > 1
                                              ? `${listing.bathrooms} baths `
                                              : `${listing.bathrooms} bath `}
                                      </li>
                                      <li className='flex items-center gap-1 whitespace-nowrap '>
                                          <FaParking className='text-lg' />
                                          {listing.parking ? 'Parking spot' : 'No Parking'}
                                      </li>
                                      <li className='flex items-center gap-1 whitespace-nowrap '>
                                          <FaChair className='text-lg' />
                                          {listing.furnished ? 'Furnished' : 'Unfurnished'}
                                      </li>
                                  </ul>
                              </div>
                              <div className="w-full h-[200px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2">
                                <MapContainer className="w-full h-full" center={[latitude, longitude]} zoom={13} scrollWheelZoom={false}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker position={[latitude, longitude]}>
                                        <Popup>
                                            A pretty CSS3 popup. <br /> Easily customizable.
                                        </Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>

                          </div>
                      </div>
                  </div>
                  
                  <div className="max-w-4xl mx-auto px-6 py-4">
                      {currentUser && listing.userRef !== currentUser._id && !contact && (
                          <button
                              onClick={() => setContact(true)}
                              className='bg-orange-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
                          >
                              Contact landlord
                          </button>
                      )}
                      {contact && <Contact listing={listing} />}
                  </div>
              </div>
          )}
      </main>
  );
}