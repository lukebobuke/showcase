-- AlterTable
ALTER TABLE "pages" ADD COLUMN     "borderEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "borderRadiusEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "borderThickness" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "fullBleedEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "marginsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "verticalSpacingEnabled" BOOLEAN NOT NULL DEFAULT true;
