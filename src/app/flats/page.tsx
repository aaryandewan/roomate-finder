import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const flats = [
  {
    id: 1,
    image: "/placeholder.svg?height=200&width=300",
    rent: 15000,
    gender: "Male",
    location: "Sector 62",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=200&width=300",
    rent: 18000,
    gender: "Female",
    location: "Sector 18",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=200&width=300",
    rent: 12000,
    gender: "Male/Female",
    location: "Sector 15",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=200&width=300",
    rent: 20000,
    gender: "Male",
    location: "Sector 50",
  },
  {
    id: 5,
    image: "/placeholder.svg?height=200&width=300",
    rent: 16000,
    gender: "Female",
    location: "Sector 76",
  },
  {
    id: 6,
    image: "/placeholder.svg?height=200&width=300",
    rent: 14000,
    gender: "Male/Female",
    location: "Sector 32",
  },
];

export default function FlatsPage() {
  const [filters, setFilters] = useState({
    gender: "",
    city: "",
    rent: "",
  });
  const [displayedFlats, setDisplayedFlats] = useState(flats);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const filteredFlats = flats.filter(
      (flat) =>
        (filters.gender === "" || flat.gender === filters.gender) &&
        (filters.city === "" || flat.location.includes(filters.city)) &&
        (filters.rent === "" || flat.rent <= parseInt(filters.rent))
    );
    setDisplayedFlats(filteredFlats);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center">
        Find Roommates in Noida
      </h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Filters</h2>
        <div className="flex flex-wrap justify-center items-end gap-4">
          <div className="w-full sm:w-auto">
            <Select
              onValueChange={(value) => handleFilterChange("gender", value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Male/Female">Male/Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-auto">
            <Select
              onValueChange={(value) => handleFilterChange("city", value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sector 62">Sector 62</SelectItem>
                <SelectItem value="Sector 18">Sector 18</SelectItem>
                <SelectItem value="Sector 15">Sector 15</SelectItem>
                <SelectItem value="Sector 50">Sector 50</SelectItem>
                <SelectItem value="Sector 76">Sector 76</SelectItem>
                <SelectItem value="Sector 32">Sector 32</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-auto">
            <Input
              type="number"
              placeholder="Max Rent (₹)"
              className="w-full sm:w-[180px]"
              value={filters.rent}
              onChange={(e) => handleFilterChange("rent", e.target.value)}
            />
          </div>

          <Button onClick={handleSearch} className="w-full sm:w-auto">
            Search
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedFlats.map((flat) => (
          <Card key={flat.id} className="overflow-hidden">
            <img
              src={flat.image}
              alt={`Flat in ${flat.location}`}
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4">
              <p className="text-2xl font-bold mb-2">₹{flat.rent}</p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">{flat.gender}</Badge>
                <p className="text-sm text-gray-600">{flat.location}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
