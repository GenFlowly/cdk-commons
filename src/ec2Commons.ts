import {
    InstanceType,
    UserData,
    SubnetType,
    SecurityGroup,
    Vpc,
    Port,
    Peer,
    Instance,
    CfnEIP,
    CfnEIPAssociation,
    MachineImage, GenericLinuxImage,
} from 'aws-cdk-lib/aws-ec2';
import {Construct} from 'constructs';
import {attachManagedPolicyToRole} from './iamCommons';
import {
    ALLOWED_SSH_PORT,
    DEFAULT_DELIMITER,
    MANAGED_POLICIES,
    STAGES,
    UBUNTU_AMI_NAME_PATTERN,
    UBUNTU_AMI_OWNER,
} from './commonConstants';
import {Ipv6Vpc} from './Ipv6Vpc';
import {Ipv6Instance} from './Ipv6Instance';

export const createIpv6Vpc = (
    construct: Construct,
    vpcId: string,
    vpcName: string,
    maxAzs: number,
    stage: STAGES,
    isPublic: boolean = true
): Vpc => {
    return new Ipv6Vpc(construct, `${vpcId}`, {
        vpcName: `${vpcName}${DEFAULT_DELIMITER}${stage}${DEFAULT_DELIMITER}IPv6VPC`,
        maxAzs: maxAzs,
        subnetConfiguration: [
            {
                name: `${vpcName}-${stage}-IPv6SubnetConfig`,
                subnetType: isPublic
                    ? SubnetType.PUBLIC
                    : SubnetType.PRIVATE_WITH_EGRESS,
                // This determines whether EC2 instance will have access to public internet or not
            },
        ],
    });
};

export const createDefaultVpc = (
    construct: Construct,
    vpcId: string,
    vpcName: string,
    maxAzs: number,
    stage: STAGES,
    isPublic: boolean = true
): Vpc => {
    return new Vpc(construct, `${vpcId}`, {
        vpcName: `${vpcName}-${stage}`,
        maxAzs: maxAzs,
        subnetConfiguration: [
            {
                name: `${vpcName}-${stage}-SubnetConfig`,
                subnetType: isPublic
                    ? SubnetType.PUBLIC
                    : SubnetType.PRIVATE_WITH_EGRESS,
                // This determines whether EC2 instance will have access to public internet or not
            },
        ],
    });
};

export const createDefaultSecurityGroup = (
    construct: Construct,
    securityGroupName: string,
    vpc: Vpc,
    securityGroupDescription: string,
    stage: STAGES,
): SecurityGroup => {
    return new SecurityGroup(construct, `${securityGroupName}-${stage}`, {
        securityGroupName: `${securityGroupName}-${stage}`,
        vpc: vpc,
        description: securityGroupDescription,
        allowAllOutbound: true,
    });
};
export const addIngressRule = (
    securityGroup: SecurityGroup,
    port: Port,
    description: string
) => {
    securityGroup.addIngressRule(Peer.anyIpv4(), port, description);
};

export const addIPv6IngressRule = (
    securityGroup: SecurityGroup,
    port: Port,
    description: string
) => {
    securityGroup.addIngressRule(Peer.anyIpv6(), port, description);
};

export const createUserData = (commands: string[]): UserData => {
    const userData = UserData.forLinux();
    userData.addCommands(...commands);
    return userData;
};


export const createIpv6Ec2Instance = (
    construct: Construct,
    ec2InstanceName: string,
    instanceType: string,
    vpc: Vpc,
    userDataContent: string,
    stage: STAGES,
): Instance => {
    const ubuntuMachineImage = MachineImage.fromSsmParameter(
      '/aws/service/canonical/ubuntu/server/24.04/stable/current/amd64/hvm/ebs-gp3/ami-id'
    );
    const userDataScript = UserData.custom(userDataContent);

    const instance = new Ipv6Instance(construct, `${ec2InstanceName}-${stage}`, {
        instanceType: new InstanceType(instanceType),
        instanceName: `${ec2InstanceName}-${stage}`,
        machineImage: ubuntuMachineImage,
        vpc: vpc,
        userData: userDataScript,
        associatePublicIpAddress: false
    });
    instance.connections.allowFrom(Peer.anyIpv4(), Port.tcp(ALLOWED_SSH_PORT));
    instance.connections.allowFrom(Peer.anyIpv6(), Port.tcp(ALLOWED_SSH_PORT));

    return instance;
};


export const createDefaultEc2Instance = (
    construct: Construct,
    ec2InstanceName: string,
    instanceType: string,
    vpc: Vpc,
    securityGroup: SecurityGroup,
    userDataContent: string,
    stage: STAGES
): Instance => {
    const ubuntuMachineImage = MachineImage.fromSsmParameter(
        '/aws/service/canonical/ubuntu/server/24.04/stable/current/amd64/hvm/ebs-gp3/ami-id'
    );
    const userDataScript = UserData.custom(userDataContent);
    return new Instance(construct, `${ec2InstanceName}-${stage}`, {
        instanceType: new InstanceType(instanceType),
        instanceName: `${ec2InstanceName}-${stage}`,
        machineImage: ubuntuMachineImage,
        vpc: vpc,
        securityGroup: securityGroup,
        userData: userDataScript,
    });
};

export const createAndAssignDefaultElasticIp = (
    construct: Construct,
    eipName: string,
    ec2Instance: Instance,
    stage: STAGES,
) => {
    const eip = createElasticIp(construct, eipName, stage);
    createElasticIpAssociation(construct, eip.ref, ec2Instance, stage);
};

export const createElasticIp = (
    construct: Construct,
    eipName: string,
    stage: STAGES,
) => {
    return new CfnEIP(construct, `${eipName}${DEFAULT_DELIMITER}${stage}`);
};

export const createElasticIpAssociation = (
    construct: Construct,
    allocationName: string,
    ec2Instance: Instance,
    stage: STAGES,
) => {
    new CfnEIPAssociation(construct, `${allocationName}${DEFAULT_DELIMITER}${stage}${DEFAULT_DELIMITER}EIPAssociation`, {
        eip: allocationName,
        instanceId: ec2Instance.instanceId,
    });
}

/**
 * Method to allow ssh into EC2 instances by attaching Session Manager Policy
 * @param instance
 */
export const attachSSMPolicyToEC2Instance = (instance: Instance) => {
    attachManagedPolicyToRole(
        instance.role,
        MANAGED_POLICIES.SSM_MANAGED_INSTANCE_CORE
    );
};
