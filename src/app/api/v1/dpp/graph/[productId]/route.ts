// --- File: src/app/api/v1/dpp/graph/[productId]/route.ts ---
// Description: Conceptual API endpoint to retrieve graph data for a DPP.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateApiKey } from "@/middleware/apiKeyAuth";
import { MOCK_DPPS, MOCK_SUPPLIERS } from "@/data";
import type { DigitalProductPassport, Supplier } from "@/types/dpp";

interface GraphNode {
  id: string;
  label: string;
  type:
    | "product"
    | "manufacturer"
    | "supplier"
    | "lifecycle_event"
    | "component";
  data?: Record<string, any>;
}

interface GraphEdge {
  id: string;
  source: string; // Node ID
  target: string; // Node ID
  label: string; // Relationship type
  data?: Record<string, any>;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
  const productId = params.productId;
  const auth = validateApiKey(request);
  if (auth) return auth;

  // Conceptual API key authentication - skipped for mock
  // const authHeader = request.headers.get('Authorization');
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return NextResponse.json({ error: { code: 401, message: 'API key missing or invalid.' } }, { status: 401 });
  // }

  const product = MOCK_DPPS.find((dpp) => dpp.id === productId);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 180));

  if (!product) {
    return NextResponse.json(
      {
        error: {
          code: 404,
          message: `Product with ID ${productId} not found.`,
        },
      },
      { status: 404 },
    );
  }

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Product Node
  nodes.push({
    id: product.id,
    label: product.productName,
    type: "product",
    data: { category: product.category, modelNumber: product.modelNumber },
  });

  // Manufacturer Node & Edge
  if (product.manufacturer?.name) {
    const manufacturerId = `mfg_${product.manufacturer.name.replace(/\s+/g, "_")}`;
    nodes.push({
      id: manufacturerId,
      label: product.manufacturer.name,
      type: "manufacturer",
      data: { did: product.manufacturer.did },
    });
    edges.push({
      id: `edge_prod_mfg_${product.id}`,
      source: manufacturerId,
      target: product.id,
      label: "manufactured_by",
    });
  }

  // Suppliers Nodes & Edges
  if (product.supplyChainLinks && product.supplyChainLinks.length > 0) {
    product.supplyChainLinks.forEach((link, index) => {
      const supplier = MOCK_SUPPLIERS.find((s) => s.id === link.supplierId);
      const supplierNodeId = `sup_${link.supplierId}`;

      if (supplier && !nodes.find((n) => n.id === supplierNodeId)) {
        nodes.push({
          id: supplierNodeId,
          label: supplier.name,
          type: "supplier",
          data: { location: supplier.location },
        });
      }

      // Component Node (conceptual, using suppliedItem as a proxy)
      const componentNodeId = `comp_${product.id}_${link.suppliedItem.replace(/\s+/g, "_")}_${index}`;
      if (!nodes.find((n) => n.id === componentNodeId)) {
        nodes.push({
          id: componentNodeId,
          label: link.suppliedItem,
          type: "component",
          data: { notes: link.notes },
        });
      }

      // Edge: Supplier -> Component
      if (supplier) {
        edges.push({
          id: `edge_sup_comp_${link.supplierId}_${index}`,
          source: supplierNodeId,
          target: componentNodeId,
          label: "supplies_item",
        });
      }

      // Edge: Component -> Product
      edges.push({
        id: `edge_comp_prod_${componentNodeId}`,
        source: componentNodeId,
        target: product.id,
        label: "is_part_of",
      });
    });
  }

  // Lifecycle Events Nodes & Edges
  if (product.lifecycleEvents && product.lifecycleEvents.length > 0) {
    product.lifecycleEvents.slice(0, 3).forEach((event) => {
      // Limit to 3 events for simplicity
      const eventNodeId = `event_${event.id}`;
      nodes.push({
        id: eventNodeId,
        label: event.type,
        type: "lifecycle_event",
        data: {
          timestamp: event.timestamp,
          location: event.location,
          responsibleParty: event.responsibleParty,
        },
      });
      edges.push({
        id: `edge_prod_event_${event.id}`,
        source: product.id,
        target: eventNodeId,
        label: "underwent_event",
      });
    });
  }

  const graphData: GraphData = { nodes, edges };

  return NextResponse.json(graphData);
}
