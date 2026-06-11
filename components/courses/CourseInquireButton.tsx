import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Course } from "@/types";

type CourseInquireButtonProps = {
  course: Course;
};

export function CourseInquireButton({ course }: CourseInquireButtonProps) {
  const params = new URLSearchParams({
    type: "class",
    subject: `Class inquiry: ${course.title}`,
    message: `Hi, I'm interested in "${course.title}". Could you share schedule and pricing details?`,
  });

  return (
    <Link href={`/contact?${params.toString()}`}>
      <Button>Inquire About This Class</Button>
    </Link>
  );
}
