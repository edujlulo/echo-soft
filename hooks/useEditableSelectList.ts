// "use client";

// import { useState, useEffect } from "react";
// import { useEditableSelectListStore } from "@/context/editableSelectListStore";
// import { useActiveVetStore } from "@/context/activeVetStore";
// import { getTextTemplates } from "@/lib/queries/textTemplates";
// import { Database } from "@/types/database";

// type TextTemplateRow = Database["public"]["Tables"]["text_templates"]["Row"];

// export function useEditableSelectList() {
//   const activeCategory = useEditableSelectListStore(
//     (state) => state.activeCategory,
//   );
//   const activeVet = useActiveVetStore((state) => state.activeVet);

//   const [templates, setTemplates] = useState<TextTemplateRow[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!activeCategory || !activeVet) {
//       setTemplates([]);
//       return;
//     }

//     // Create an AbortController to cancel previous fetches
//     const controller = new AbortController();
//     const signal = controller.signal;

//     // ============= FETCH TEMPLATES FROM DB ============
//     const fetchTemplates = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         // getTextTemplates does not support native signal, so we handle abort manually
//         const data = await getTextTemplates(activeVet.vet_id, activeCategory);

//         if (!signal.aborted) {
//           setTemplates(data);
//         }
//       } catch (err: any) {
//         if (!signal.aborted) {
//           console.error(err);
//           setError(err.message ?? "Failed to fetch text templates");
//           setTemplates([]);
//         }
//       } finally {
//         if (!signal.aborted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchTemplates();

//     // Cleanup: if activeCategory changes, abort the previous fetch
//     return () => {
//       controller.abort();
//     };
//   }, [activeCategory, activeVet]);

//   // Public setter
//   function addTemplateLocal(template: TextTemplateRow) {
//     setTemplates((prev) => [...prev, template]);
//   }

//   return { templates, loading, error, addTemplateLocal };
// }
