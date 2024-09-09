import {Fn, Tags} from 'aws-cdk-lib';
import {
    Instance,
    InstanceProps,
    SecurityGroup,
} from 'aws-cdk-lib/aws-ec2';
import {Construct} from 'constructs';

export class Ipv6Instance extends Instance {
    constructor(scope: Construct, id: string, props: InstanceProps) {
        const securityGroup = props.securityGroup
            ? undefined
            : new SecurityGroup(scope, `${id}:InstanceSecurityGroup`, {
                vpc: props.vpc,
                allowAllOutbound: true,
                allowAllIpv6Outbound: true,
            });

        super(scope, id, {securityGroup, ...props});
        if (securityGroup) {
            Tags.of(securityGroup).add("Name", props.instanceName || this.node.path);
        }
    }
}