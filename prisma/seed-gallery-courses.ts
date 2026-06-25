import { PrismaClient } from "@prisma/client";
import galleryData from "../data/gallery.json";
import coursesData from "../data/courses.json";

const prisma = new PrismaClient();

async function main() {
  const existingGallery = await prisma.galleryImage.count();
  const existingCourses = await prisma.course.count();

  if (existingGallery === 0) {
    for (const [index, image] of galleryData.entries()) {
      await prisma.galleryImage.create({
        data: {
          src: image.src,
          alt: image.alt,
          order: index,
        },
      });
    }
    console.log(`Added ${galleryData.length} gallery images.`);
  } else {
    console.log(`Skipped gallery (${existingGallery} images already exist).`);
  }

  if (existingCourses === 0) {
    for (const course of coursesData) {
      await prisma.course.create({
        data: {
          slug: course.slug,
          title: course.title,
          description: course.description,
          duration: course.duration,
          skillLevel: course.skillLevel,
          priceNote: course.priceNote,
          modules: course.modules,
        },
      });
    }
    console.log(`Added ${coursesData.length} classes.`);
  } else {
    console.log(`Skipped classes (${existingCourses} already exist).`);
  }

  console.log("Done.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
