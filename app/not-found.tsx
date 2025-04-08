import Link from "next/link";
import { Button } from "@/components/ui/basic/button";
import Image from "next/image";

/**
 * Renders a 404 error page.
 *
 * This component displays a centered layout with a logo image (rendered without optimization), a "404" heading,
 * a message indicating that the page does not exist, and a button that navigates back to the homepage.
 *
 * @returns The JSX element representing the 404 error page.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <div className="mb-6">
        <Image
          src="https://149667878.v2.pressablecdn.com/wp-content/uploads/2022/07/01-main-color-launchpad-logo.png"
          alt="Launchpad Logo"
          width={200}
          height={200}
          className="object-contain"
          unoptimized={true}
        />
      </div>
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <Link href="/">
        <Button size="lg">Go Back Home</Button>
      </Link>
    </div>
  );
}
