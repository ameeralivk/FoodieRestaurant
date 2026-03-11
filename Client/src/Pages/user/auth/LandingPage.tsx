import React, { useState } from "react";
import { Search } from "lucide-react";
import Navbar from "../../../Components/Layouts/userLayouts/Navbar";
import { useEffect } from "react";
import { styled } from "@mui/material/styles";
import { getDistanceInKm } from "../../../Components/Helpers/user/Location";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  RestaurantDetailsModal,
  type Restaurant,
} from "../../../Components/modals/user/UserRestauarentDetailModal";
import { getAllRestaurent } from "../../../services/superAdmin";
import UserPagination from "../../../Components/Component/user/userPagination";
import RestaurantFilters from "../../../Components/Component/user/restaraurentFilter";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";
import { getUserLocation } from "../../../Components/Helpers/user/Location";
import isOpenNow from "../../../Components/Helpers/user/restuarentAvailability";
import { ToastContainer } from "react-toastify";
import { getActivePlanByRestaurant } from "../../../services/planService";
import { getAllItems } from "../../../services/ItemsService";
import { useDispatch } from "react-redux";
import { setRestaurantName } from "../../../redux/slice/userSlice";
const UserLandingPage: React.FC = () => {
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  const [loating, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [maxDistance, setMaxDistance] = useState(5); // km
  const [openNow, setOpenNow] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [sortBy, setSortBy] = useState<"distance" | "name">("distance");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [total, setTotal] = useState(10);
  const limit = 10;
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    if (!userLocation) return;

    // const fetchData = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await getAllRestaurent(false, page, limit, searchTerm);
    //     if (response && response.success) {
    //       await new Promise((res) => setTimeout(res, 300));

    //       const updatedRestaurants = response.data.map((restaurant: any) => {
    //         if (!restaurant.location?.coordinates) return restaurant;
    //         const [lng, lat] = restaurant.location.coordinates;
    //         const distance = getDistanceInKm(
    //           userLocation.latitude,
    //           userLocation.longitude,
    //           lat,
    //           lng,
    //         );
    //         return { ...restaurant, distance: `${distance.toFixed(1)} km` };
    //       });

    //       setRestaurants(updatedRestaurants);
    //       setTotal(response.pagination.totalPages);
    //     }
    //   } catch (err) {
    //     console.error(err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await getAllRestaurent(false, page, limit, searchTerm);

        if (response && response.success) {
          await new Promise((res) => setTimeout(res, 300));

          // check subscription for each restaurant
          const restaurantsWithPlan = await Promise.all(
            response.data.map(async (restaurant: any) => {
              try {
                // const planResponse = await getActivePlanByRestaurant(
                //   restaurant._id,
                // );

                // if (!planResponse?.data?.success) {
                //   return null; // remove restaurant
                // }

                const itemsResponse = await getAllItems(
                  restaurant._id,
                  1,
                  10,
                  "",
                );
                if (!itemsResponse?.data || itemsResponse.data.length === 0) {
                  return null;
                }

                if (!restaurant.location?.coordinates) return restaurant;

                const [lng, lat] = restaurant.location.coordinates;

                const distance = getDistanceInKm(
                  userLocation.latitude,
                  userLocation.longitude,
                  lat,
                  lng,
                );

                return {
                  ...restaurant,
                  distance: `${distance.toFixed(1)} km`,
                };
              } catch {
                return null;
              }
            }),
          );

          // remove restaurants without active plan
          const filteredRestaurants = restaurantsWithPlan.filter(Boolean);

          setRestaurants(filteredRestaurants);
          setTotal(response.pagination.totalPages);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userLocation, page, searchTerm]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };
  useEffect(() => {
    getUserLocation()
      .then((loc) => {
        setUserLocation(loc);
      })
      .catch(() => alert("Location permission denied"));
  }, []);

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };


  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Convert file to ImageData
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        // code.data contains the URL from QR
        navigate(new URL(code.data).pathname + new URL(code.data).search);
      } else {
        alert("No QR code detected");
      }
    };
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <Navbar isShowProfile={true} />
      <ToastContainer />
      <RestaurantDetailsModal
        restaurant={selectedRestaurant}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-orange-100/40 blur-3xl opacity-60 animate-pulse"></div>
          <div className="absolute top-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-amber-100/40 blur-3xl opacity-60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Delicious Food, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                Just a Scan Away
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              Scan the QR code at your table to view the menu and order
              instantly. No waiting, just eating.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    handleFileUpload(files);
                  };
                  input.click();
                }}
                className="group relative flex items-center justify-center gap-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-4 px-10 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-lg">Scan QR Code</span>
              </button>

              <div className="relative">
                <Button
                  component="label"
                  role={undefined}
                  tabIndex={-1}
                  className="!h-auto !py-4 !px-8 !rounded-2xl !bg-white !text-gray-700 !font-bold !shadow-md hover:!shadow-lg hover:!bg-gray-50 !transition-all !duration-300 !transform hover:!-translate-y-1 !border-0"
                  startIcon={<CloudUploadIcon className="text-orange-500" />}
                >
                  Upload QR Image
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(event) => handleFileUpload(event.target.files)}
                    multiple={false}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="sticky top-16 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RestaurantFilters
            maxDistance={maxDistance}
            setMaxDistance={setMaxDistance}
            openNow={openNow}
            setOpenNow={setOpenNow}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-10 relative max-w-2xl mx-auto -mt-8 z-30">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            </div>
            <input
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              type="text"
              placeholder="Search for restaurants, cuisines..."
              className="w-full pl-16 pr-6 py-5 bg-white border-0 rounded-full shadow-lg text-gray-800 placeholder-gray-400 text-lg focus:ring-4 focus:ring-orange-100 transition-all duration-300"
            />
          </div>
        </div>

        {/* Nearby Restaurants Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Explore Restaurants
              </h2>
              <p className="text-gray-500 mt-1">
                Found {total} places near you
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loating && (
            <div className="flex justify-center items-center py-32">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-orange-200 border-solid rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-orange-600 border-t-transparent border-solid rounded-full animate-spin"></div>
              </div>
            </div>
          )}

          {/* Restaurant Grid */}
          {!loating && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
                  <div className="bg-orange-50 p-6 rounded-full mb-6">
                    <Search className="w-12 h-12 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No restaurants found
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    We couldn't find any restaurants matching your search. Try
                    different keywords or adjust your location.
                  </p>
                </div>
              ) : (
                // restaurants.map((restaurant) => {
                restaurants
                  .filter((r) => r.status === "approved") // ✅ approved
                  .filter((r) => {
                    if (!r.distance) return true;
                    return parseFloat(r.distance) <= maxDistance;
                  })
                  .filter((r) => {
                    if (!openNow) return true;
                    if (!r.openingTime || !r.closingTime) return false;
                    return isOpenNow(r.openingTime, r.closingTime);
                  })
                  .filter((r) => {
                    if (!selectedCity) return true;
                    const search = selectedCity.toLowerCase();
                    return (
                      r.city?.toLowerCase().includes(search) ||
                      r.placeName?.toLowerCase().includes(search)
                    );
                  })
                  .sort((a, b) => {
                    if (sortBy === "name") {
                      return a.restaurantName.localeCompare(b.restaurantName);
                    }
                    return (
                      parseFloat(a.distance || "0") -
                      parseFloat(b.distance || "0")
                    );
                  })
                  .map((restaurant) => {
                    // Generate random data for demo (you can replace with actual data from API)
                    const rating = (Math.random() * 2 + 3.5).toFixed(1); // 3.5-5.5 rating

                    return (
                      <div
                        onClick={() => handleRestaurantClick(restaurant)}
                        key={restaurant.id}
                        className="group bg-white rounded-3xl shadow-sm hover:shadow-xl hover:shadow-orange-500/10 border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                      >
                        {/* Image Section */}
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={
                              restaurant.restaurantPhoto ||
                              "/placeholder-restaurant.jpg"
                            }
                            alt={restaurant.restaurantName}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

                          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                            <div>
                              <h3 className="text-white text-xl font-bold truncate mb-1 shadow-sm">
                                {restaurant.restaurantName}
                              </h3>
                              <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
                                  <svg
                                    className="w-4 h-4 text-yellow-400 fill-current"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                  </svg>
                                  {rating}
                                </span>
                                {restaurant.distance && (
                                  <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
                                    {restaurant.distance}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Restaurant Info */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-2">
                              <span className="bg-orange-50 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full border border-orange-100">
                                Restaurant
                              </span>
                              {restaurant.openingTime &&
                                restaurant.closingTime && (
                                  <span
                                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                                      isOpenNow(
                                        restaurant.openingTime,
                                        restaurant.closingTime,
                                      )
                                        ? "bg-green-50 text-green-700 border-green-100"
                                        : "bg-red-50 text-red-700 border-red-100"
                                    }`}
                                  >
                                    {isOpenNow(
                                      restaurant.openingTime,
                                      restaurant.closingTime,
                                    )
                                      ? "Open Now"
                                      : "Closed"}
                                  </span>
                                )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-6">
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="truncate">
                                {restaurant.openingTime} -{" "}
                                {restaurant.closingTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span className="truncate">
                                {restaurant.city || "Nearby"}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(setRestaurantName(restaurant.restaurantName))
                              navigate(`/user/restaurant/${restaurant._id}`);
                            }}
                            className="w-full bg-gray-50 text-gray-900 font-bold py-3.5 px-4 rounded-xl hover:bg-orange-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-orange-500/20"
                          >
                            <span>View Menu</span>
                            <svg
                              className="w-4 h-4 transition-transform group-hover:translate-x-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loating && restaurants.length > 0 && (
          <div className="mt-16 mb-8 flex justify-center">
            <UserPagination
              currentPage={page}
              totalPages={total}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default UserLandingPage;
