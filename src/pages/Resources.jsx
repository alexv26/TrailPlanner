import styles from "./page_styles/Resources.module.css";
import ResourceLinkTile from "../components/ResourceLinkTile";

export default function Resources() {
  return (
    <>
      <ResourceLinkTile
        title="Gear Lists"
        bodyText="A comprehensive packing list for you to take on your adventures."
        imgLink="https://images.squarespace-cdn.com/content/v1/57eef4589de4bb8a699eb6fc/1599182506201-BCOO06DGQM5D1HJFWI63/4th-1.jpg"
        directTo="#"
      />
      <ResourceLinkTile
        title="Campsite Resources"
        bodyText="A handy resource designed to help you find a campsite."
        imgLink="https://www.gearo.com/wp-content/uploads/2018/09/campsite_concierge1.png"
        directTo="#"
      />
      <ResourceLinkTile
        title="Making a meal plan"
        bodyText="A comprehensive guide on how to make a meal plan for any outdoor adventure."
        imgLink="https://www.the-hungry-hiker.com/wp-content/uploads/2023/05/How-I-Put-Together-a-Backpacking-Meal-Plan-for-An-Overnight-Backpacking-Trip_Blog-Post-Square-scaled.jpg"
        directTo="#"
      />
    </>
  );
}
