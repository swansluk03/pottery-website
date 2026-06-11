import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types";

type InquireButtonProps = {
  product: Product;
};

export function InquireButton({ product }: InquireButtonProps) {
  const params = new URLSearchParams({
    type: "purchase",
    subject: `Inquiry: ${product.title}`,
    message: `Hi, I'm interested in "${product.title}". Please let me know if it's still available and how to purchase.`,
  });

  return (
    <Link href={`/contact?${params.toString()}`}>
      <Button className="min-w-[180px]">
        {product.available ? "Inquire to Purchase" : "Join Waitlist"}
      </Button>
    </Link>
  );
}
