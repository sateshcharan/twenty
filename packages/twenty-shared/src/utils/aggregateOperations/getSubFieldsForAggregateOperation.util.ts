import { FieldMetadataType } from 'src/types/FieldMetadataType';
import { isCompositeFieldMetadataType } from 'src/utils/aggregateOperations/isCompositeFieldMetadataType.util';

export const getSubfieldsForAggregateOperation = (
  fieldType: FieldMetadataType,
): string[] | undefined => {
  if (!isCompositeFieldMetadataType(fieldType)) {
    return undefined;
  } else {
    switch (fieldType) {
      case FieldMetadataType.CURRENCY:
        return ['amountMicros', 'currencyCode'];
      case FieldMetadataType.FULL_NAME:
        return ['firstName', 'lastName'];
      case FieldMetadataType.ADDRESS:
        return [
          'addressStreet1',
          'addressStreet2',
          'addressCity',
          'addressPostcode',
          'addressState',
          'addressCountry',
          'addressLat',
          'addressLng',
        ];
      case FieldMetadataType.LINKS:
        return ['primaryLinkUrl'];
      case FieldMetadataType.ACTOR:
        return ['workspaceMemberId'];
      case FieldMetadataType.EMAILS:
        return ['primaryEmail'];
      case FieldMetadataType.PHONES:
        return [
          'primaryPhoneNumber',
          'primaryPhoneCountryCode',
          'primaryPhoneCallingCode',
        ];
      default:
        throw new Error(`Unsupported composite field type: ${fieldType}`);
    }
  }
};
