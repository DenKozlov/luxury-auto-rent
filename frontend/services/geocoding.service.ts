import axios from "axios";

const getAddress = async (position: { lat: number; lng: number } | null) => {
  if (!position) {
    return;
  }
  const { lat, lng } = position;
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/reverse",
    {
      params: {
        format: "json",
        lat,
        lon: lng,
      },
    },
  );

  const data = response.data;

  if (!data) {
    throw new Error("Address not found for these coordinates");
  }
  return data.display_name;
};

export default getAddress;
