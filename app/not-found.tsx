import Link from "next/link";
import { Button } from "@/components/ui/basic/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
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