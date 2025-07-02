import ClientPage from "./clientPage";
import WhoAmI from "./whoAmI";

// Because the client is the parent of the server commponent, we need to exit the page and go bacck in to refresh.
// line 16 of ipdateUsername.js
export default async function WhoAmIPage() {
  return (
    <ClientPage id={1}>
      <WhoAmI />
    </ClientPage>
  );
}
