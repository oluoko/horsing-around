import { Metadata } from "next";

export const Meta = ({
  title,
  description,
}: {
  title: string;
  description: string;
}): Metadata => ({
  title,
  description,
});
