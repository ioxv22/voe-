
import { db } from "./firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    condition: (history: any[]) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: "first_watch",
        title: "The Beginning",
        description: "Watch your first movie on VOZ.",
        icon: "🎬",
        condition: (history) => history.length >= 1
    },
    {
        id: "movie_buff",
        title: "Movie Buff",
        description: "Watch 10 movies.",
        icon: "🍿",
        condition: (history) => history.filter(h => h.media_type === 'movie').length >= 10
    },
    {
        id: "binge_watcher",
        title: "Binge Watcher",
        description: "Watch 30 episodes of TV shows.",
        icon: "📺",
        condition: (history) => history.filter(h => h.media_type === 'tv').length >= 30
    },
    {
        id: "midnight_owl",
        title: "Midnight Owl",
        description: "Watch something after midnight.",
        icon: "🦉",
        condition: (history) => {
            const hours = new Date().getHours();
            return hours >= 0 && hours <= 4 && history.length > 0;
        }
    }
];

export async function checkAchievements(userId: string, history: any[], currentAchievements: string[]) {
    const newlyUnlocked: Achievement[] = [];
    
    for (const achievement of ACHIEVEMENTS) {
        if (!currentAchievements.includes(achievement.id)) {
            if (achievement.condition(history)) {
                newlyUnlocked.push(achievement);
            }
        }
    }

    if (newlyUnlocked.length > 0) {
        const userRef = doc(db, "users", userId);
        const achievementIds = newlyUnlocked.map(a => a.id);
        await updateDoc(userRef, {
            achievements: arrayUnion(...achievementIds)
        });
    }

    return newlyUnlocked;
}
