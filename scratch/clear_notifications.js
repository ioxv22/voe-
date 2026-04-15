import { db } from "../src/lib/firebase";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";

async function clearOldNotifications() {
    console.log("Starting cleanup...");
    
    // Clear notifications collection
    const notifSnap = await getDocs(collection(db, "notifications"));
    console.log(`Found ${notifSnap.size} notifications. Deleting...`);
    for (const d of notifSnap.docs) {
        await deleteDoc(doc(db, "notifications", d.id));
    }

    // Clear alert banner in config
    const configRef = doc(db, "system", "config");
    await deleteDoc(configRef); // Or just update to clear fields
    
    console.log("Cleanup complete!");
}

clearOldNotifications();
