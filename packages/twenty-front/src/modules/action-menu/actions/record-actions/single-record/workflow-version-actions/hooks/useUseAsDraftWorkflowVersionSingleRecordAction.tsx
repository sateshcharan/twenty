import { useSelectedRecordIdOrThrow } from '@/action-menu/actions/record-actions/single-record/hooks/useSelectedRecordIdOrThrow';
import { ActionHookWithoutObjectMetadataItem } from '@/action-menu/actions/types/ActionHook';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { buildShowPageURL } from '@/object-record/record-show/utils/buildShowPageURL';
import { OverrideWorkflowDraftConfirmationModal } from '@/workflow/components/OverrideWorkflowDraftConfirmationModal';
import { useCreateDraftFromWorkflowVersion } from '@/workflow/hooks/useCreateDraftFromWorkflowVersion';
import { useWorkflowVersion } from '@/workflow/hooks/useWorkflowVersion';
import { useWorkflowWithCurrentVersion } from '@/workflow/hooks/useWorkflowWithCurrentVersion';
import { openOverrideWorkflowDraftConfirmationModalState } from '@/workflow/states/openOverrideWorkflowDraftConfirmationModalState';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { isDefined } from 'twenty-ui';

export const useUseAsDraftWorkflowVersionSingleRecordAction: ActionHookWithoutObjectMetadataItem =
  () => {
    const recordId = useSelectedRecordIdOrThrow();

    const workflowVersion = useWorkflowVersion(recordId);

    const workflow = useWorkflowWithCurrentVersion(
      workflowVersion?.workflow?.id ?? '',
    );

    const { createDraftFromWorkflowVersion } =
      useCreateDraftFromWorkflowVersion();

    const setOpenOverrideWorkflowDraftConfirmationModal = useSetRecoilState(
      openOverrideWorkflowDraftConfirmationModalState,
    );

    const navigate = useNavigate();

    const workflowStatuses = workflow?.statuses;

    const shouldBeRegistered =
      isDefined(workflowVersion) &&
      isDefined(workflow) &&
      isDefined(workflowStatuses) &&
      workflowVersion.status !== 'DRAFT';

    const onClick = async () => {
      if (!shouldBeRegistered) return;

      const hasAlreadyDraftVersion = workflowStatuses.includes('DRAFT');

      if (hasAlreadyDraftVersion) {
        setOpenOverrideWorkflowDraftConfirmationModal(true);
      } else {
        await createDraftFromWorkflowVersion({
          workflowId: workflowVersion.workflow.id,
          workflowVersionIdToCopy: workflowVersion.id,
        });

        navigate(
          buildShowPageURL(
            CoreObjectNameSingular.Workflow,
            workflowVersion.workflow.id,
          ),
        );
      }
    };

    const ConfirmationModal = shouldBeRegistered ? (
      <OverrideWorkflowDraftConfirmationModal
        workflowId={workflowVersion.workflow.id}
        workflowVersionIdToCopy={workflowVersion.id}
      />
    ) : undefined;

    return {
      shouldBeRegistered,
      onClick,
      ConfirmationModal,
    };
  };
