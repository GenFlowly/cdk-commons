import { Construct } from 'constructs';
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';

export const createCertificate = (
  construct: Construct,
  domainName: string,
  certificateName: string
): Certificate => {
  return new Certificate(construct, certificateName, {
    domainName: domainName,
    validation: CertificateValidation.fromDns(),
  });
};
