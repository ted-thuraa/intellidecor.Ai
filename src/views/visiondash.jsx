import React, { useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Skeleton from "../components/skeleton";
import DropZone from "../components/DropZone";
import appendNewToName from "../utils/appendNewToName";
import downloadPhoto from "../utils/downloadPhoto";
import Original1 from "../assets/images/bad4.jpg";
import Render1 from "../assets/images/bad4-neww.jpg";
import Original2 from "../assets/images/bad5.jpg";
import Render2 from "../assets/images/bad5-new.jpg";
import Original3 from "../assets/images/badinterior.jpg";
import Render3 from "../assets/images/badinterior-new.jpg";

import axiosClient from "../axios-client";

export default function Visiondash() {
  const { token } = useStateContext();
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const [originalPhoto, setOriginalPhoto] = useState(null);
  const [restoredImage, setRestoredImage] = useState(null);
  const [room, setRoomValue] = useState("Living room");
  const [mode, setModeValue] = useState("Interior design");
  const [style, setStyleValue] = useState("Modern");
  const [renders, setRendersValue] = useState("1");
  const [resolution, setResolutionValue] = useState("Low");
  const [privacy, setPrivacyValue] = useState("Public");
  const [publicRenders, setPublicRenders] = useState([]);
  const [loadingRenders, setLoadingRenders] = useState(false);

  const [restoredLoaded, setRestoredLoaded] = useState(false);
  const [phoneRenderOn, setPhoneRenderOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cancelUrl, setCancelUrl] = useState(null);
  const [sideBySide, setSideBySide] = useState(false);
  const [photoName, setPhotoName] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRenders();
  }, []);

  const getRenders = () => {
    setLoadingRenders(true);
    setError(null);
    axiosClient
      .get("/renders")
      .then(({ data }) => {
        setLoadingRenders(false);
        setPublicRenders(data.data);
      })
      .catch((err) => {
        setLoadingRenders(false);

        const response = err.response;

        if (response && response.status == 422) {
          if (response.data.errors) {
            setError(response.data.errors);
          } else if (response.data.error) {
            setError(response.data.error);
          } else {
            setError({
              email: [response.data.message],
            });
          }
        }
      });
  };

  // setting inputs
  const setOriginalImg = (img, name) => {
    setOriginalPhoto(img);
    setPhotoName(name);
  };

  const setRoom = (ev) => {
    setRoomValue(ev.target.value);
  };

  const setMode = (ev) => {
    setModeValue(ev.target.value);
  };

  const setStyle = (ev) => {
    setStyleValue(ev.target.value);
  };

  const setRenders = (ev) => {
    setRendersValue(ev.target.value);
    if (ev.target.value === "4") {
      navigate("/pricing");
    }
  };

  const setResolution = (ev) => {
    setResolutionValue(ev.target.value);
    if (ev.target.value === "High") {
      navigate("/pricing");
    }
  };

  const setPrivacy = (ev) => {
    setPrivacyValue(ev.target.value);
    if (ev.target.value === "Private") {
      navigate("/pricing");
    }
  };

  const _setError = (message) => {
    setError(message);
    setLoading(false);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  const setRestoredPhoto = (img) => {
    setLoading(false);
    setRestoredImage(img);
  };

  const startGeneration = (
    originalPhoto,
    room,
    style,
    mode,
    renders,
    resolution,
    privacy
  ) => {
    setLoading(true);
    generateImage(
      originalPhoto,
      room,
      style,
      mode,
      renders,
      resolution,
      privacy
    );
  };

  const generateImage = async (photo) => {
    setError(null);
    try {
      const formdata = new FormData();

      formdata.append("originalPhoto", photo);
      formdata.append("room", room);
      formdata.append("style", style);
      formdata.append("mode", mode);
      formdata.append("renders", renders);
      formdata.append("resolution", resolution);
      formdata.append("privacy", privacy);
      const response = await axiosClient.post("/design", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.id) {
        setCancelUrl(response.data.urls.cancel);
      }
      let newPhoto = await getStatus(response.data.id, photo);
    } catch (error) {
      const response = error.response;

      if (response && response.status == 429) {
        if (response.data.message) {
          _setError(
            "You have reached today's limit buy the app to get the full experience"
          );
        }
      } else if (response && response.status == 500) {
        _setError("Failed");
      }
    }
  };

  async function getStatus(id, photo) {
    const res = await axiosClient.get("/status/" + id);
    if (res.data.status !== "succeeded") {
      setTimeout(async () => {
        await getStatus(id);
      }, 1000);
    } else if (res.data.status == "failed") {
      _setError("failed");
      return;
    } else if (res && res.status == 429) {
      if (res.data.message) {
        _setError("took too long try again later");
      }
      return;
    } else {
      getBase64FromUrl(res.data.output[1]).then((data) => {
        setRestoredPhoto(data);
        saveData(originalPhoto, data, photo);
      });
      //setRestoredPhoto(resphoto);
      //console.log(restoredImage);
      //saveData(originalPhoto, restoredImage, photo);
    }
  }

  const cancelRender = (cancelUrl) => {
    axiosClient
      .post("/cancel", cancelUrl)
      .then(({ data }) => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  };

  const saveData = async (originalPhoto, restoredImage, photo) => {
    try {
      const formdata = new FormData();

      formdata.append("originalPhoto", originalPhoto);
      formdata.append("restoredPhoto", restoredImage);
      formdata.append("room", room);
      formdata.append("style", style);
      formdata.append("mode", mode);
      formdata.append("privacy", privacy);
      const response = await axiosClient.post("/save", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      const response = error.response;
    }
  };

  const setPhoneRenderStatus = () => {
    setPhoneRenderOn(!phoneRenderOn);
  };

  const classNameMode = phoneRenderOn ? "block" : "hidden";

  const rooms = [
    {
      roomType: "Living room",
      value: "Living room",
    },
    {
      roomType: "Dinning room",
      value: "Dinning room",
    },
    {
      roomType: "Kitchen",
      value: "Kitchen",
    },
    {
      roomType: "Study room",
      value: "Study room",
    },
    {
      roomType: "Bedroom",
      value: "Bedroom",
    },
    {
      roomType: "Bathroom",
      value: "Bathroom",
    },
    {
      roomType: "Gaming room",
      value: "Gaming room",
    },
    {
      roomType: "Home office",
      value: "Home office",
    },
    {
      roomType: "Fitness gym",
      value: "Fitness gym",
    },
    {
      roomType: "Coffee shop",
      value: "Coffee shop",
    },
    {
      roomType: "Clothing store",
      value: "Clothing store",
    },
    {
      roomType: "Restaurant",
      value: "Restaurant",
    },
    {
      roomType: "Office",
      value: "Office",
    },
    {
      roomType: "Meeting room",
      value: "Meeting room",
    },
    {
      roomType: "Exhibition space",
      value: "Exhibition space",
    },
    {
      roomType: "Hotel room",
      value: "Hotel room",
    },
  ];
  const styles = [
    {
      roomStyle: "Modern",
      value: "Modern",
    },
    {
      roomStyle: "Minimalist",
      value: "Minimalist",
    },
    {
      roomStyle: "Conteporary",
      value: "Conteporary",
    },
    {
      roomStyle: "Scandinavian",
      value: "Scandinavian",
    },
    {
      roomStyle: "Tropical",
      value: "Tropical",
    },
    {
      roomStyle: "Zen",
      value: "Zen",
    },
    {
      roomStyle: "Industrial",
      value: "Industrial",
    },
    {
      roomStyle: "Rustic",
      value: "Rustic",
    },
    {
      roomStyle: "Coastal",
      value: "Coastal",
    },
    {
      roomStyle: "Farmhouse",
      value: "Farmhouse",
    },
    {
      roomStyle: "Vintage",
      value: "Vintage",
    },
  ];
  const modes = [
    {
      modeType: "interior design",
      value: "interior design",
    },
    {
      modeType: "freestyle",
      value: "freestyle",
    },
  ];
  const privacyStatus = [
    {
      privacy: "Public",
      value: "Public",
    },
    {
      privacy: "Private(pro)",
      value: "Private",
    },
  ];
  const noOfRenders = [
    {
      no: 1,
      value: 1,
    },
    {
      no: "4(pro)",
      value: 4,
    },
  ];
  const imgResolution = [
    {
      res: "low",
      value: "low",
    },
    {
      res: "High(pro)",
      value: "High",
    },
  ];

  return (
    <div className="background_bluish">
      <div className="fixed z-10 md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
        <Header />
      </div>
      <div className="max-screen container mx-auto  flex md:flex-row relative ">
        <div
          className={`${classNameMode} md:w-2/5 like-root md:block min-h-screen md:left-0 absolute sidebar  pt-16 pb-3.5 overflow-y-hidden overflow-x-auto`}
        >
          <div className="h-screen p-8 overflow-x-hidden overflow-y-scroll">
            <div className="block ">
              <div className="pb-6">
                <h2 className="text-white text-xl font-semibold">
                  Your current interior
                </h2>
              </div>
              <div className="pb-6">
                {!originalPhoto && !restoredImage && !loading && (
                  <DropZone
                    onRestoredImgChange={setRestoredPhoto}
                    onOriginalImgChange={setOriginalImg}
                    onError={setError}
                  />
                )}
                {originalPhoto && !restoredImage && !loading && (
                  <img
                    alt="original photo"
                    src={originalPhoto}
                    className="rounded-2xl"
                    width={475}
                    height={475}
                  />
                )}
              </div>
              <div className="pb-6">
                <p className="text-white text-sm font-light">
                  Take a photo of your current room. For best results make sure
                  it shows the entire room in a 90° straight angle facing a wall
                  or window horizontally. Not from a corner or angled, and not a
                  wide angle photo as it's trained on regular photos. The AI
                  isn't great at angled pics (yet)!. To make 100% private HQ
                  renders upgrade to Pro and you get your own private workspace.
                </p>
              </div>
              <div className="pb-6">
                <label
                  for="countries"
                  class="block mb-2 text-sm font-medium text-gray-50 dark:text-white"
                >
                  Room
                </label>
                <select
                  id="room"
                  value={room}
                  onChange={setRoom}
                  placeholder="Select"
                  class="bg-gray-900 border border-gray-300 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  {rooms.map((room, roomindex) => (
                    <option key={roomindex} value={room.value}>
                      {room.roomType}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pb-6">
                <label
                  for="mode"
                  class="block mb-2 text-sm font-medium text-gray-50 dark:text-white"
                >
                  Mode
                </label>
                <select
                  id="mode"
                  value={mode}
                  onChange={setMode}
                  class="bg-gray-900 border border-gray-300 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  {modes.map((mode, modeindex) => (
                    <option key={modeindex} value={mode.value}>
                      {mode.modeType}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pb-6">
                <p className="text-white text-sm font-light">
                  Take a photo of your current room. For best results make sure
                  it shows the entire room in a 90° straight angle facing a wall
                  or window horizontally (click for example).
                </p>
              </div>
              <div className="pb-6">
                <label
                  for="style"
                  class="block mb-2 text-sm font-medium text-gray-50 dark:text-white"
                >
                  Style
                </label>
                <select
                  id="style"
                  value={style}
                  onChange={setStyle}
                  class="bg-gray-900 border border-gray-300 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  {styles.map((style, styleindex) => (
                    <option key={styleindex} value={style.value}>
                      {style.roomStyle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pb-6">
                <label
                  for="countries"
                  class="block mb-2 text-sm font-medium text-gray-50 dark:text-white"
                >
                  Number of renders
                </label>
                <select
                  id="renders"
                  value={renders}
                  onChange={setRenders}
                  class="bg-gray-900 border border-gray-300 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  {noOfRenders.map((no, noindex) => (
                    <option key={noindex} value={no.value}>
                      {no.no}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pb-6">
                <label
                  for="countries"
                  class="block mb-2 text-sm font-medium text-gray-50 dark:text-white"
                >
                  Resolution
                </label>
                <select
                  id="resolution"
                  value={resolution}
                  onChange={setResolution}
                  class="bg-gray-900 border border-gray-300 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  {imgResolution.map((res, resolutionindex) => (
                    <option key={resolutionindex} value={res.value}>
                      {res.res}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pb-6">
                <label
                  for="countries"
                  class="block mb-2 text-sm font-medium text-gray-50 dark:text-white"
                >
                  Privacy
                </label>
                <select
                  id="privacy"
                  value={privacy}
                  onChange={setPrivacy}
                  class="bg-gray-900 border border-gray-300 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  {privacyStatus.map((privacy, privindex) => (
                    <option key={privindex} value={privacy.value}>
                      {privacy.privacy}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pb-6">
                <p className="text-white text-sm font-light">
                  <strong>Tip:</strong>
                  Take a photo of your current room. For best results make sure
                  it shows the entire room in a 90° straight angle facing a wall
                  or window horizontally (click for example).
                </p>
              </div>
              <div className="pb-6">
                {!loading && !restoredImage && (
                  <button
                    onClick={() => {
                      if (
                        originalPhoto &&
                        room &&
                        style &&
                        mode &&
                        renders &&
                        resolution &&
                        privacy &&
                        !loading
                      ) {
                        startGeneration(
                          originalPhoto,
                          room,
                          style,
                          mode,
                          renders,
                          resolution,
                          privacy
                        );
                      }
                      {
                        setPhoneRenderStatus();
                      }
                    }}
                    type="button"
                    class="text-white w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    render new idea
                  </button>
                )}

                {originalPhoto && !loading && restoredImage && (
                  <button
                    onClick={() => {
                      setOriginalPhoto(null);
                      setRestoredImage(null);
                      setRestoredLoaded(false);
                      setError(null);
                      setPhoneRenderStatus();
                    }}
                    type="button"
                    class="text-white w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Upload New Photo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-3/5 block  min-h-screen md:right-0 absolute   pt-16 pb-3.5 overflow-y-hidden overflow-x-auto">
          <div className="h-screen p-8 overflow-x-hidden overflow-y-scroll">
            {!originalPhoto && (
              <>
                <div className="sticky block justify-center text-center">
                  <div className="block">
                    <p className="border w-1\2 md:mr-36 md:ml-36 rounded-2xl py-1 px-4 text-slate-200 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out">
                      <span className="font-bold">400k+</span> photos generated
                      and counting.{" "}
                    </p>
                  </div>

                  <div className="mb-6 md:hidden">
                    <button
                      onClick={setPhoneRenderStatus}
                      type="button"
                      class="text-white w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    >
                      render new idea
                    </button>
                  </div>
                </div>
                <div className="block ">
                  {loadingRenders && (
                    <>
                      <div className="flex sm:space-x-4 sm:flex-row flex-col mb-6">
                        <div className="relative inline-block overflow-hidden md:w-1/2">
                          <Skeleton />
                        </div>
                        <div className="relative inline-block overflow-hidden  md:w-1/2">
                          <Skeleton />
                        </div>
                      </div>
                      <div className="flex sm:space-x-4 sm:flex-row flex-col mb-6">
                        <div className="relative inline-block overflow-hidden md:w-1/2">
                          <Skeleton />
                        </div>
                        <div className="relative inline-block overflow-hidden md:w-1/2">
                          <Skeleton />
                        </div>
                      </div>
                    </>
                  )}

                  {/* {!loadingRenders &&
                    publicRenders.map((pair) => (
                      <div className="flex sm:space-x-4 sm:flex-row flex-col mb-6">
                        <div className="relative inline-block overflow-hidden ">
                          <div className="absolute bg-slate-900 bg-opacity-60 bottom-0 right-0 z-10 mb-1 font-light text-sm text-white">
                            Original Photo
                          </div>
                          <img
                            alt="original photo"
                            src={pair.originalimage_url}
                            className="rounded-2xl relative object-cover"
                            width={475}
                            height={475}
                          />
                        </div>
                        <div className="relative inline-block overflow-hidden sm:mt-0 mt-8">
                          <div className="absolute bg-slate-900 bg-opacity-60 bottom-0 right-0 z-10 mb-1 font-light text-sm text-white">
                            {pair.prompt}
                          </div>
                          <a
                            href={pair.restoredimage_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              alt="restored photo"
                              src={pair.restoredimage_url}
                              className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in"
                              width={475}
                              height={475}
                              onLoadingComplete={() => setRestoredLoaded(true)}
                            />
                          </a>
                        </div>
                      </div>
                    ))} */}
                  {!loadingRenders && (
                    <>
                      <div className="flex sm:space-x-4 sm:flex-row flex-col mb-6">
                        <div className="relative inline-block overflow-hidden ">
                          <div className="absolute bg-slate-900 bg-opacity-60 bottom-0 right-0 z-10 mb-1 font-light text-sm text-white">
                            Original Photo
                          </div>
                          <img
                            alt="original photo"
                            src={Original1}
                            className="rounded-2xl relative object-cover"
                            width={475}
                            height={475}
                          />
                        </div>
                        <div className="relative inline-block overflow-hidden sm:mt-0 mt-8">
                          <div className="absolute bg-slate-900 bg-opacity-60 bottom-0 right-0 z-10 mb-1 font-light text-sm text-white">
                            Original render
                          </div>
                          <a href={Render1} target="_blank" rel="noreferrer">
                            <img
                              alt="restored photo"
                              src={Render1}
                              className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in"
                              width={475}
                              height={475}
                            />
                          </a>
                        </div>
                      </div>
                      <div className="flex sm:space-x-4 sm:flex-row flex-col mb-6">
                        <div className="relative inline-block overflow-hidden ">
                          <div className="absolute bg-slate-900 bg-opacity-60 bottom-0 right-0 z-10 mb-1 font-light text-sm text-white">
                            Original Photo
                          </div>
                          <img
                            alt="original photo"
                            src={Original2}
                            className="rounded-2xl relative object-cover"
                            width={475}
                            height={475}
                          />
                        </div>
                        <div className="relative inline-block overflow-hidden sm:mt-0 mt-8">
                          <div className="absolute bg-slate-900 bg-opacity-60 bottom-0 right-0 z-10 mb-1 font-light text-sm text-white">
                            Original render
                          </div>
                          <a href={Render2} target="_blank" rel="noreferrer">
                            <img
                              alt="restored photo"
                              src={Render2}
                              className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in"
                              width={475}
                              height={475}
                            />
                          </a>
                        </div>
                      </div>
                      <div className="flex sm:space-x-4 sm:flex-row flex-col mb-6">
                        <div className="relative inline-block overflow-hidden ">
                          <div className="absolute bg-slate-900 bg-opacity-60 bottom-0 right-0 z-10 mb-1 font-light text-sm text-white">
                            Original Photo
                          </div>
                          <img
                            alt="original photo"
                            src={Original3}
                            className="rounded-2xl relative object-cover"
                            width={475}
                            height={475}
                          />
                        </div>
                        <div className="relative inline-block overflow-hidden sm:mt-0 mt-8">
                          <div className="absolute bg-slate-900 bg-opacity-60 bottom-0 right-0 z-10 mb-1 font-light text-sm text-white">
                            Original render
                          </div>
                          <a href={Render3} target="_blank" rel="noreferrer">
                            <img
                              alt="restored photo"
                              src={Render3}
                              className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in"
                              width={475}
                              height={475}
                            />
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
            {originalPhoto && !restoredImage && !loading && (
              <img
                alt="original photo"
                src={originalPhoto}
                className="rounded-2xl"
                width={475}
                height={475}
              />
            )}
            {originalPhoto && loading && (
              <div className="flex sm:space-x-4 sm:flex-row flex-col">
                <div className="w-1/2">
                  <h2 className="mb-1 font-medium text-lg text-white">
                    Original
                  </h2>
                  <img
                    alt="original photo"
                    src={originalPhoto}
                    className="rounded-2xl relative"
                    width={475}
                    height={475}
                  />
                </div>
                <div className="sm:mt-0 mt-8 w-1/2">
                  <h2 className="mb-1 font-medium text-lg text-white">
                    New render
                  </h2>

                  <Skeleton />
                </div>
              </div>
            )}
            {restoredImage && originalPhoto && !sideBySide && (
              <div className="flex sm:space-x-4 sm:flex-row flex-col">
                <div>
                  <h2 className="mb-1 font-medium text-lg text-white">
                    Original
                  </h2>
                  <img
                    alt="original photo"
                    src={originalPhoto}
                    className="rounded-2xl relative"
                    width={475}
                    height={475}
                  />
                </div>
                <div className="sm:mt-0 mt-8">
                  <h2 className="mb-1 font-medium text-lg text-white">
                    New render
                  </h2>
                  <a href={restoredImage} target="_blank" rel="noreferrer">
                    <img
                      alt="restored photo"
                      src={restoredImage}
                      className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in"
                      width={475}
                      height={475}
                      onLoadingComplete={() => setRestoredLoaded(true)}
                    />
                  </a>
                </div>
              </div>
            )}
            {loading && (
              <>
                <button
                  disabled
                  type="button"
                  class="bg-white rounded-full text-black font-medium px-4 pt-2 pb-3 mt-8 mr-5 hover:bg-gray-300 w-40"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    class="inline w-4 h-4 mr-3 text-black animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Loading...
                </button>
                {/* {cancelUrl && (
                                    <button
                                        onClick={cancelRender(cancelUrl)}
                                        className="bg-white rounded-full text-white font-medium px-4 pt-2 pb-3 mt-8 hover:bg-gray-300 w-40"
                                    >
                                        <span className="pt-4 text-black">
                                            Cancel
                                        </span>
                                    </button>
                                )} */}
              </>
            )}
            {error && (
              <div
                id="toast-warning"
                class="fixed flex items-center top-20 w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow  left-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800"
                role="alert"
              >
                <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="sr-only">Warning icon</span>
                </div>
                <div class="ml-3 text-sm font-normal">{error}</div>
              </div>
            )}
            {originalPhoto && !loading && (
              <div className="flex space-x-2 justify-center">
                <button
                  onClick={() => {
                    setOriginalPhoto(null);
                    setRestoredImage(null);
                    setRestoredLoaded(false);
                    setError(null);
                  }}
                  className="bg-rgb rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-black/80"
                >
                  Upload New Photo
                </button>
              </div>
            )}
            {restoredImage && originalPhoto && (
              <button
                onClick={() => {
                  if (restoredImage && photoName) {
                    downloadPhoto(restoredImage, appendNewToName(photoName));
                  }
                }}
                className="bg-white rounded-full text-black border font-medium px-4 py-2 mt-8 hover:bg-gray-100 transition"
              >
                Download Restored Photo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
