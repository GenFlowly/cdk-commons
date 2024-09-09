import {Fn, Tags} from 'aws-cdk-lib';
import {
    Instance,
    InstanceProps,
    Peer,
    Port,
    SecurityGroup,
} from 'aws-cdk-lib/aws-ec2';
import {Construct} from 'constructs';

export class Ipv6Instance extends Instance {
    constructor(scope: Construct, id: string, props: InstanceProps) {
        const securityGroup = props.securityGroup
            ? props.securityGroup
            : new SecurityGroup(scope, `${id}:IPv6SecurityGroup`, {
                securityGroupName: `${id}:IPv6SecurityGroup`,
                vpc: props.vpc,
                allowAllOutbound: true,
                allowAllIpv6Outbound: true,
            });

        securityGroup.addIngressRule(Peer.anyIpv6(), Port.HTTPS, "Allow HTTPS on IPv6");
        securityGroup.addIngressRule(Peer.anyIpv6(), Port.HTTP, "Allow HTTP on IPv6");

        super(scope, id, {securityGroup, ...props});
        if (securityGroup) {
            Tags.of(securityGroup).add("Name", props.instanceName || this.node.path);
        }
    }
}