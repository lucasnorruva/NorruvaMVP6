import { Server } from "lucide-react";
import {
  ListDigitalProductPassports,
  RetrieveDigitalProductPassport,
  CreateDigitalProductPassport,
  UpdateDigitalProductPassport,
  ExtendDigitalProductPassport,
  AddLifecycleEventToDpp,
  ArchiveDigitalProductPassport,
} from "./api-reference";

interface DppEndpointsProps {
  exampleListDppsResponse: string;
  exampleDppResponse: string;
  conceptualCreateDppRequestBody: string;
  conceptualCreateDppResponseBody: string;
  conceptualUpdateDppRequestBody: string;
  conceptualUpdateDppResponseBody: string;
  conceptualDeleteDppResponseBody: string;
  conceptualPatchDppExtendRequestBody: string;
  conceptualPatchDppExtendResponseBody: string;
  addLifecycleEventRequestBodyExample: string;
  addLifecycleEventResponseExample: string;
  error401: string;
  error404: string;
  error500: string;
  error400_create_dpp: string;
  error400_update_dpp: string;
  error400_patch_dpp: string;
  error400_lifecycle_event: string;
}

export default function ApiReferenceDppEndpoints(props: DppEndpointsProps) {
  return (
    <section id="dpp-endpoints">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <Server className="mr-3 h-6 w-6 text-primary" /> Digital Product
        Passport (DPP) Endpoints
      </h2>
      <ListDigitalProductPassports
        exampleListDppsResponse={props.exampleListDppsResponse}
        error401={props.error401}
        error500={props.error500}
      />
      <RetrieveDigitalProductPassport
        exampleDppResponse={props.exampleDppResponse}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
      <CreateDigitalProductPassport
        conceptualCreateDppRequestBody={props.conceptualCreateDppRequestBody}
        conceptualCreateDppResponseBody={props.conceptualCreateDppResponseBody}
        error400_create_dpp={props.error400_create_dpp}
        error401={props.error401}
        error500={props.error500}
      />
      <UpdateDigitalProductPassport
        conceptualUpdateDppRequestBody={props.conceptualUpdateDppRequestBody}
        conceptualUpdateDppResponseBody={props.conceptualUpdateDppResponseBody}
        error400_update_dpp={props.error400_update_dpp}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
      <ExtendDigitalProductPassport
        conceptualPatchDppExtendRequestBody={
          props.conceptualPatchDppExtendRequestBody
        }
        conceptualPatchDppExtendResponseBody={
          props.conceptualPatchDppExtendResponseBody
        }
        error400_patch_dpp={props.error400_patch_dpp}
      />
      <AddLifecycleEventToDpp
        addLifecycleEventRequestBodyExample={
          props.addLifecycleEventRequestBodyExample
        }
        addLifecycleEventResponseExample={
          props.addLifecycleEventResponseExample
        }
        error400_lifecycle_event={props.error400_lifecycle_event}
      />
      <ArchiveDigitalProductPassport
        conceptualDeleteDppResponseBody={props.conceptualDeleteDppResponseBody}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
    </section>
  );
}
