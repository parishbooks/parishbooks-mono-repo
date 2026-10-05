import type { HelmetOptions } from 'helmet';

export type DefineHelmetProps = {
    isProd: boolean;
};

export const defineHelmet = ({ isProd }: DefineHelmetProps): HelmetOptions => ({
    contentSecurityPolicy: isProd
        ? undefined
        : {
              directives: {
                  defaultSrc: [`'self'`],
                  styleSrc: [`'self'`, `'unsafe-inline'`],
                  imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
                  scriptSrc: [`'self'`, `'unsafe-inline'`],
              },
          },
});
