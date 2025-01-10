import * as React from "react";
import Link from "next/link";
import { Home, PuzzleIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export function NavBar() {
  return (
    <div className="w-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4">
      <NavigationMenu className="max-w-screen-xl mx-auto">
        <NavigationMenuList className="flex justify-center items-center space-x-4">
          <NavigationMenuItem className="flex-1 text-center">
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className="flex flex-col items-center p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200">
                <Home className="w-6 h-6 text-white mb-1" />
                <span className="text-white font-bold">Home</span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem className="flex-1 text-center">
            <Link href="/puzzle/play" legacyBehavior passHref>
              <NavigationMenuLink className="flex flex-col items-center p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200">
                <PuzzleIcon className="w-6 h-6 text-white mb-1" />
                <span className="text-white font-bold">Puzzles</span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
