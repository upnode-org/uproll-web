// "use client"; // If using Next.js App Router, mark client-side usage

// import * as React from "react";

// // shadcn UI command components
// import {
//   Command,
//   CommandInput,
//   CommandList,
//   CommandEmpty,
//   CommandGroup,
//   CommandItem,
// } from "@/components/ui/command";

// interface DockerRepo {
//   name: string;
//   // Add other fields if needed, e.g., official, star_count, etc.
// }

// export default function DockerImageSearch() {
//   const [query, setQuery] = React.useState("");
//   const [results, setResults] = React.useState<DockerRepo[]>([]);
//   const [loading, setLoading] = React.useState(false);

//   React.useEffect(() => {
//     // If query is empty, clear results
//     if (!query.trim()) {
//       setResults([]);
//       return;
//     }

//     const fetchDockerImages = async () => {
//       setLoading(true);
//       try {
//         // Using the local rewrite URL
//         const response = await fetch(
//           `/docker-hub/v2/search/repositories/?query=${encodeURIComponent(query)}`
//         );
//         if (!response.ok) {
//           throw new Error("Docker Hub search failed");
//         }
//         const data = await response.json();

//         // Map Docker Hub data to our local DockerRepo type
//         const mappedResults = data.results?.map((item: any) => ({
//           name: item.name,
//           // Map any additional fields if needed
//         })) as DockerRepo[];

//         console.log(mappedResults);

//         setResults(mappedResults);
//       } catch (error) {
//         console.error("Error fetching Docker images:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDockerImages();
//   }, [query]);

//   // Handle selection (e.g., storing it or logging it)
//   const handleSelect = (name: string) => {
//     alert(`Selected Docker image: ${name}`);
//     // You can do something more useful here, like setting form state, etc.
//   };

//   return (
//     <div className="w-full max-w-sm">
//       <Command>
//         <CommandInput
//           placeholder="Search Docker images (e.g. grafana, prometheus)"
//           onValueChange={(value) => setQuery(value)}
//         />
//         <CommandList>
//           {loading && (
//             <div className="p-2 text-sm text-gray-500">Searching...</div>
//           )}
//           <CommandEmpty>No results found.</CommandEmpty>
//           {!loading && results.length > 0 && (
//             <CommandGroup heading="Docker Images">
//               {results.map((repo) => (
//                 <CommandItem
//                   key={repo.name}
//                   onSelect={() => handleSelect(repo.name)}
//                 >
//                   {repo.name}
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           )}
//         </CommandList>
//       </Command>
//     </div>
//   );
// }
