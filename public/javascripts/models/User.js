var post = inclusive.post;
var put = inclusive.put;
var get = inclusive.get;

var rsa = forge.pki.rsa;
var pki = forge.pki;

var keybasePrivateKey = '-----BEGIN PGP PRIVATE KEY BLOCK-----\n' +
'Version: Keybase OpenPGP v2.0.1\n' +
'Comment: https://keybase.io/crypto\n' +
'\n' +
'xcaGBFTP4MwBEADOx95L57u9p3lnByMpPdKbtOixTupsPDMNIFmB71cmD6Lp8KNC\n' +
'6WPJCgobbDHB3FBdfonoXg/4xhPHaJCntN9tdtTVb0M2Jc+z+NyThaOotGjB3tM0\n' +
'wouWgVSKQcOfxJNkd4uRJjNwqIpB5Yy4dOoTE0g9SDciX+OVG3PzXBjzHu+IjSFV\n' +
'B57pd2sU2M4kLAIjSDscJl7chsnyMglB25bPbxZhZf01YLDKHVp9DwCs/zUBrfVl\n' +
'i3nwXKsytkkqxQaHJMh2JQ0ug76IgOR9fz+qpxSyQOjaPCYk1jLkRLCbXozVREHr\n' +
'bVPmS4hb5ltNVPcVrHYB14sDD417Dh3cs/cp2ZyaqMJZc/DkwoJ/h+PcHbB64gFf\n' +
'x4v8birt9zVz0mfpPU9a7FiMJtAs4NTrs8Sj3CBbNYyfkkIPI9SVc/wmCbZVaSGl\n' +
'pUqmT0rTHfh3RMfu62tbzRDlM4TDMGoHXBUIo4dj6PBSgBy5x2IdeZFKmNapcDKb\n' +
'NxUv2Xw4rSxVax9kGixfwn7xLZ+achPGfmZOaH6o8mxMBC5kAcq8TxNOPo9EPk3y\n' +
'ZqCjPGVudRlksUMYa1JlFNqawZmHZcRZ/FOLFxRfzXDjo+H57rzwwkipUtKkws7M\n' +
'6ic1IAG6Hg5K3KHO+mtPXb085DGGZUuvr8+WeW1h+iaGYTaSxnNYqTeK6wARAQAB\n' +
'/gkDCEJBXxkXUq6LYEN1+plLe7bDJWY6taXLIzIBLMVt9IujI1qFrI7k71k9XvPc\n' +
'cBumdQEqW8HFTniGX4hx13JI7xNZFa/XQTkqQxhFWqhrTYkfbbtMaAE+UjGSBNFr\n' +
'CWsSESkN4uvLfqOc2vBBb6sd8F3TVmVfiGprtlthvM6qvlxzG1RvDgQ7LoqJ8Ljg\n' +
'o7g2z6u1OHa/TQNozYMKRYJAvj3LRBXrJZR0wdrmar6KE1hjLj9SWtSah1N7mag9\n' +
'GQNENXw4SGzxy2gPH9qnaPIioVxcnukgsaIyoG6MlGTpY0dZROSlvhPANTqnIIdE\n' +
'VbbGve32I7r+Pl+DZcZ2LExmwXFEdn171rKDhFbxyf8O0NiQ9nrHNgI9EV4U6TM0\n' +
'VpwmzcOa0iBtCp/XSZWDaFI/y5PgmpQfz6xKZex73KKNPCdg2+4PLighqWpcDmEh\n' +
'Zkk44KksSFqNDCJ6o6ZG/tfF0ROmEuTSUIWOGPksyxz/8vB8AjWiHY43tNDmkSG0\n' +
'03ArEmm6ushU0yuCGlRE6O6YUuE8pKv/8Bva34zesDJTetWMb7USJDSSgu7YWZor\n' +
'WC/TJqjiFdA4Ix/LVoCTvwDJ6AxbvqvI6sMBtARGnI+uOTJFJhNpEhr2QxqGI7Bo\n' +
'ae5hMK7eLhqCMxHh9TFybnDVT9UF0VhGC+mzc2fIKQw9OwM06G0uaiQrL9XiGJbP\n' +
'66Kd3v11H+7NRaNdln6l4YXePrnG8brJJ2MAS4Cg7s3j1svPglnYY+aQsVTURpfO\n' +
'9jRGm4R+xTStsHhvofx9/uxmCgfjYUy3RJ7L/nUOWxffGPJObtHaoCt9ZEm0ke41\n' +
'S4uUHWumlSGN0205ttdLrMAx1TzcL868aqN/O63dzXtdiWm47qeNea4CysJEhl2/\n' +
'knAgwgLm2KgG3soVy2vYpC98Ge7yRPVXUicXhA8WtZcHWUiVM/mnZndyczFpXtVB\n' +
'WfbRFAyrDB/qmMpq2kd1FmNdfrgnwd/XYMuT16mUwPE6FS9WG7WStH3k3Q5Bxr+Q\n' +
'U+bAlIsS8GaqYX48YrtgYjL8cWnKVsI/zyO9bqQTHxKi8L4TzN1lA5AEmJ7c2Ej4\n' +
'NCmF/meZUr51haEvpuvdP8FpS4HbJm74Pua68324oLjpPlPn6UVNrhyy35tH3zDL\n' +
'qP28+2htPnxf6MeYlsPZhdDsWpyz5RQ8BPfEJ1gaCGs27OtUm/pLlPbCbrdBHypl\n' +
'/iTmox+zs68aqhkGWHGsRNnthrfUv7KDTZyz6b1MPQapIshoeqrieHnjOddvhvOl\n' +
'V4QbD13hMU8sJ8JINY5m9KprYLeMratTiK53AjT96qTp4FP4G7meJ3iP+i0Je3xa\n' +
'qUojPcmEwtCPfLsGPE7YMU8IsNIV6Xwu7Crxm6s+MOmhZsPwmy7LM4CJFKn2GUC6\n' +
'W5/1cPRVdgsHzqLXAK+hVFlhKfOpgtJmtxZT0hsLOJBUDs/XKNiTqb54qujrWx80\n' +
'3wE83kSiQnpCFrY4uSdrc8yLdVRtJMYEgV1Pq/Rr4vV+AR1PpF8d5c/MgBytMs5U\n' +
'PZ7/W0MFfMopMyuQAyzlTSbxZwsiemyBo39nUtfpTfVU07fvDYIXoxm4zl1hw+mP\n' +
'nXyIuDdEwor9Wp/HbHt9p1Py34GcwMk6EhnDISZCx7OZY8FY4KSmA8UVhvfp2uEU\n' +
'KQ8NDgdueo3asrx6YiGi/mFmQdOgesxstnskR7EPlGTfZjn0IDOvAe+nOd/iOB/M\n' +
'2xPD8EqEZ45PgoX9t0AQ3xp6FW3zTUh6awWE/cfsnQICERGIXn4xewzNH2tleWJh\n' +
'c2UuaW8vbGl5IDxsaXlAa2V5YmFzZS5pbz7CwXAEEwEKABoFAlTP4MwCGy8DCwkH\n' +
'AxUKCAIeAQIXgAIZAQAKCRDUuSitFsK7AYD2D/9cadO/II8fe38qjpYT9jNFnMQv\n' +
'xiVMzJQQ/rDMnGoexAnJE6+pO8YKslL0YAtFx7P5NFvgVbe4M9ACcJ4MWRZGxoju\n' +
'RxaYH6IMWcCPB42OH0ZAgsS4fpYcGqSWgGJM/aQhfwFnqz9hMiXEWVo6UGzXn0n0\n' +
'GnqpgxnqRuPbCCIDjmE97TGqnWHsi9hE4Nz9Bxc/oz35kMEgGbScsacshys75EMP\n' +
'DeIaCFDKB74u9LiF6LVoyZZbtW3I85dMhCg9BGfNABb0MIEJcDRcxtsWaGhbhbln\n' +
'qHqIvUtNYbL39gIEICn3OhzcFYPfXFjnJTHpy/Cy0nQgnDSVNXfBx852JbemMejy\n' +
'Fwc5gswdNZlq2UeKBpCmSGMzyB8RqU5wUJ9mfb6/dIfwLVCxOKpz6ML2tCpWmHqY\n' +
'1ctkoc17aoY72SnmI785s8ENzaSVEOLDmUwxrsWOnUuwsn32W9gMZDdDtQhOA/Gm\n' +
'E+9i51iQVY33tOSmRpccpB8pk16dLwJX20RtXoP0Rb5lFahKEEDgSfuAt2BBJBBj\n' +
'IRs+Dnl92A/IoDBq60zg3VygWbsuxAPT9/mcQzddCqUn96DanJQMh6Q/HFG0f5mQ\n' +
'MMGIUCpyOYV4laA1tOu0MgK3R3zIuGeXmfsO4CQTaZnaRxnCNl3sGlS5kDjFn6E4\n' +
'ITRDI/Ck+DvpLVEYKsfDBgRUz+DMAQgAmyuHUtN/yWU/oqN0rXYan4XTNWXpW3FL\n' +
'gYF+oMhlQe1VBtKLhXIow4nYxAB0YHFEwV4onJhjmBM9rL5ShfJT939Ntzt5XTpy\n' +
'lDfX0xY6HumXo84UOHtspsyqFTHKsVUMtZ+AX5NSEwmerYp8wDlSDCXbxGzyH3jn\n' +
'yQent5bT81gKglQRO3pjePB5dfG+0X3PoHg7VKQiB456Ped34exlaQKNYl3lrTmE\n' +
'Mtmh7ReDgnmqh0BEVHOhd7buJ/ZiKoF4swcuobm4QyRR/oz/N3aCTGiLr4zFklsG\n' +
'h3ayqhmJCJTzTFJz/7lTY3CYABiIBlH1rvhzXVLEATZJzn3uTuBClwARAQAB/gkD\n' +
'CGCbDH8hKa0oYCNg9UHX6eyJoUnJvKsZBE1EJST2IYWw6JOOUXucozQujMf69YZH\n' +
'zOU4AxjO99ZnqKHncDuzpi/byJwQR1tUcalbuLo0Uauo7nMd/i1KwXR6WlCFGd89\n' +
'01aapCdYVA9LFtMx0Dx/rdTpCjuGzF1WK6nOS7oZS+qNlis8O6fBy6XZaQczBZUf\n' +
'tMHp7ks2FVdbocEi5XWTUQqpyKxWWkgfzRPTU0g/++dIP4WHyGoEhvTQ/Fgrms0h\n' +
'kdo/4+7BxjUqWa9bbeZe5vFuwZkOVkRiuUna50okf1blUY4ti72D+/rMBbnt1MS0\n' +
'NNHjiRZuhmHx4O274s3Kh9evOZ6X6pDN4gLHvM8qUcoHEmxDqS14Ts3OKYk32gSC\n' +
'g1KAAf1d/2EDtYAUhgzN9zCSwOCK23wSVfDqUOOlKtkTMpeDqA/CVf/dg9YhZ5cW\n' +
'ElYyaJZ23XhGcK8XlaEh3RYidRDai5qVqjcnUsx0md2ZLoBXDdAdK+vh2mIk3h4P\n' +
'vLsalneOkyE7LQUSGNnX9O3AKpa3oYohSe/+6lvHvV9nzNp9G0mnFCDg0p1vDlTI\n' +
'fgp0P0UgjMryzyDeoQuzEcVBfpikT8VWL3zqSEsVht4mJaJTD1wbjH29ZCJtEpQX\n' +
'yU+VISTYI9hWG99YCiw/kQrW3ul/P0+XBR5JV2UIQfP/W5MLE9uSq7uhEa/V2KLW\n' +
'VPbhH9sD7Wo7s9wb1YlnYxTmPzFBPDleaaI19atnNFi3SSArbGA6FhdnycC5T8i9\n' +
'xZHiXFP20on1FCIqrfHkcrDHzW4C4Bp1y4rdbdLYkb9EJLlTnKaKi4N9VemnIkNu\n' +
'HC2g0iQFtRQz4O8J+8VbhgV5c2x4H8TPmR5LDCcjBSJuq63NC8t+LQEqxnwBhoT9\n' +
'ELbIgLtfrf1V9D9nUqSXPCEofTGsAcLChAQYAQoADwUCVM/gzAUJDwmcAAIbAgEp\n' +
'CRDUuSitFsK7AcBdIAQZAQoABgUCVM/gzAAKCRBttx214apcb4jgB/9055ffIolJ\n' +
'a+JMAjuu8e7nRiwe95KqI7/4JKeMSIBrfJVkbilPFHbYkR7hArERRWTN9UBHnyDc\n' +
'o1yewkrBOpEAb2h60WngK0NIp2n0WftOFZNlKXkP/iPq3aoeTOLwLwN/LYE7cvkd\n' +
'xXEhawCbYDjRr7KHZW8FOZMbVH5+lfg+v7qTqizIKIi60hC+vBycL9X43u6/LuFP\n' +
'9TE7TfaUjQ6nco9QPC1Q+3VxMdJYnMd1N87sBQHJO5KCgh4iDmnVZPwFRwGcpx7e\n' +
'LqTUBd0bF187kzOGiYIITb9Dv7en5YOa5gb6fRZq5aaziEQUPbK8V4ZQeU97kR1n\n' +
'uCBU7/2aMvVaGcwQALiay25Ro7GPzBktoKLuNhDTAefYxZrUv+R/HvgJ9afA3Nn8\n' +
'M/Tx5dH35XJSUX8nib/JmGvgefnkZpMr62HBEXkJRoRtruX0I934JxpBYA/+Q9Rx\n' +
'2tvq2Wew3wqFOTcCvPrauYldQyM9z+YHvyAw4HzvlVMER/0tH16Ra8xk7J3q6DeI\n' +
'+/cN7Ec7FlSLbkGJqiC2+19g3f5S3+ot4fonqUvHr3R2JEoIKksK/88ASQqFlapZ\n' +
'yIJuXxIXo8eCihx36NVNbaf5mBzPJBqbM23osN73RceYnnTC6+cO8fS8ZMnZmmnt\n' +
'hFyzVE1D4SDImOpufpV5XdqetsTClDOYcyRBS1IKgnbbcyONOzXUOt2gm2RJ5+U1\n' +
'7dBCRV5Ip+6h7tkdIUhlaUHJNpsrdUZUjT8yPys1G+noGpORQ+zoqh1gfI1erams\n' +
'JYFdu26IxfeurB7ZioTTasOPNq+1dHE8Sej7IcRIF13AEtYSrG3eCLY/KXyVO7kj\n' +
'8tN3WP5IkiDWwYgVH/pkiou+cNzYxDHDPK8+9MWIQxAiNEq6Tbbr0mFFXT4ZwEWG\n' +
'zTYypsj68ddxPSUbpIW4MWbX80aW4bABaecCtbucezdeSs4PQvBD5dCh+7wq6fjZ\n' +
'VmE6bmz6Mu6jkYm8ugqJHBW+jkBy6EbMF2RaCjilHqm8THKjdhA5CqEQplMax8MG\n' +
'BFTP4MwBCACwcw7LJiXvlwCXQ0zievyRS0ebW5Gy5btOp41PU20iEVhJwS8QQNQT\n' +
'acczz+ZgPBMNbL6jjdCKCOhFZtks/6bP/0q04nh1d9wNCllOXxtESn7jnCfK65bv\n' +
'BVLQ1bceTBkYC9CBTrr4ywwC/Y4eN/LPJMPxBM+pg2bkmwQ42XnbBBk0Dc42626p\n' +
'coo2dnUsj2qvgm1Gr391HXjKnOB+TtORGFsGBMr9xoJmtw/z4nQbVRmaJZg56q5j\n' +
'F3wGNw/2rkEheyUHQ5hcpgY9g0rYDkZoNI1F/zgRTUL77XC4N7pRDIKjPfTDz6JX\n' +
'fdUp9J+u9J+KWEHtFb7NiEzU6GIc9+SFABEBAAH+CQMIOUCCvdHJKFpg37ta1VJG\n' +
'VqIvO250Cny6JV02do1T4B7P2GzPVj+rEqF/qxooYopfEkE9WteLQYm36P9z7vF5\n' +
'TRu0F81OJqxByfmrfqo5b7zUKgzTRGZFioD7nPkFGuOzkQYT5na47wanMisJhwuQ\n' +
'yU+jOFDDqgRLLeJPwVkrj6AIabV3Sc+MwVaAVadFa4xtVTMZ5xHGMNgGUTqMqPF6\n' +
'odYNC0xQpYIuSFi6Lo4Z51uDVap9TrCG+qZm4IEuEwAO0KJge5xYaLcxhoeIedLM\n' +
'qADY929EySInr3Ej1RdbSVRsKoO2UVeefRQEC6VMSQkiO9F5i1TSE7TXSiLpmD43\n' +
'bHgDaTxeK1RHSxWgXY2tKJwZO8ijvuhsTY8h5tnqd5E1pkl6c4kPYsx0cyXHFVc+\n' +
'oAErLDEEAgJPExuEwfKzRJXSVvmc1csk20jibGgG2G3UX/1YyGUFkSJx1jmDzSsO\n' +
'eEvEemf6SgSqga4wAQsgXj2GuPab9QE5lP5+Ep+asDjNH3PbbpnF1ogh+gg4OpoX\n' +
'Is9HGN5WmXTyxnWXc6204uMDE/0MsUhu3mJ402kDu2IXIpzuFWKs2CEOLtH7ROhw\n' +
'KNDKJtJUUgQlxBjSLWA0LHIfiaPJnO45bwQaYG59s3LMKpD3uR4LO94gt89Zy7XQ\n' +
'Zxw+N5GcsJpla7v/4fOYHAcGstwmjbJjs88UpTQTbSZ2F7z1hZuOWU2KlWcckOtT\n' +
'xR5iRwCNOyq3009mpZkJASZO6BQ9BJS3t9xcNcQvqVbDIbQVJ8Mzq/j+K6f7BNUu\n' +
'Tgf5y0ZhN8NIOY0AUv7K0MuWC/uuRfef3pTvTT1ystdtAIKvamnMAFVmSwSAE5u0\n' +
'SQdNNTl96wBTuILKBBPi+D9wMF/T8w9fV0snUadzBqCsQEJ1IBsZoUq+1WVh+o2t\n' +
'O4/UySqqwsKEBBgBCgAPBQJUz+DMBQkPCZwAAhsMASkJENS5KK0WwrsBwF0gBBkB\n' +
'CgAGBQJUz+DMAAoJEO6A7YC9Sz/hSwEIAKEBq84y+EfupK1R1HIJZWzbZ9g+1CMF\n' +
'FebwD5DS9hejlVsVA+efmttctGDS7kpBrjTuTFgnpRU0Sw1FAL01DlgBfrHSAElE\n' +
'HFZjP/MT+wdwA2DnrnB988tFAs5K6ziVH0u39L5eHf7Ck/MIswr13+S/qrbYX4kz\n' +
'LTcWu5ZDydYZFLe1bZJZtvwAeaoAg5FPx0P4S1XM7SqfkGGUUapvWqilBD5o1a0X\n' +
'cUfBganhueNZjLALSc6H3Cw46AovAmHVDhe+BNJcK2NYkWL3VZ1FAxMka7cmwhJ9\n' +
'Bcxg6n9Aka4225AL22inx2xc29jWvitJb8rG6yCRdzIYrbbkLQHOdwfvqA/+NjbR\n' +
'ICRolvIv9hdAryDGPZ0VVHCnctx3Sl2nSn3n0U5CWePDFYHn9+SYIl6bWG1Xva30\n' +
'fOLI3h0kr3cM1LsUcS72wq+C5PCzXriUbTJJs4cWdz5HKyKJlJiy+54HRjhIOP29\n' +
'0kf/4hgbqReiYSYUhn7QSSJlOJIIq7VE+279uLS5jRa2U6d2EZPnknapM0nte7wb\n' +
'VIqAvHCwybMmWUYgjdJ6mn47qisS/hOM0N2qLgypCTiEvf8+f6R82nK9GhpstQbs\n' +
'h2pAlkxqZl4XHgTv01ZOOxbIjUT0WQ6A2lD7Kqt/zkshQ+80GqrneQl4y/dH6qfA\n' +
'PZq7sOSR2dEqrcrm2H9LjSBhalt19/MozrNDDbYBuCNH6np+dYRkpLtAKddyInSK\n' +
'OEnuG5aS3f9uypwRl7+sASZwz5s65bHFRhXwB/RphG5hiXjAbfgEJtfN+2mxcyBD\n' +
'TgV502HfuXk6M+vGjJ7Cg7U2v3JksOvQXzSD4hXASEtwpmpAXri5P1XL3Jr4Btnh\n' +
'PYib6lWCTTIfXulMWDDgyklNi5446R1J5qR3lBi3sN80jCFuS9A5LSSobyFpMeVV\n' +
'md6Dmpmxo9T4jKSB583n6OR0jBlG2P/vw2oYeppEnypbdDonTQcAPU+TerMrlQbv\n' +
'UkLgTHC+gbPkq/f2zv6NGx9NKA0/krj0rpFXOmM=\n' +
'=QhlW\n' +
'-----END PGP PRIVATE KEY BLOCK-----\n';

var liy;
var passphrase = 'xxxxx';
get('https://keybase.io/liy/key.asc').then(function(result){
  kbpgp.KeyManager.import_from_armored_pgp({
    armored: result
  }, function(err, user) {

    if (!err) {
      var mergeCompleted = function(){
        if(user.is_pgp_locked()){
          user.unlock_pgp({passphrase: passphrase}, function(err){
            if(!err){
              console.log('private key unlocked');
            }
          });
        }

        console.log('user loaded', user);
        liy = user;


      };

      // liy = user;
      // console.log("liy is loaded");
      // console.log(liy);
      user.merge_pgp_private({
        armored: keybasePrivateKey
      }, mergeCompleted);
    }
  });
}).then(function(){
  kbpgp.box({
    msg: 'message to myself',
    encrypt_for: liy,
    sign_with: liy
  }, function(err, result_string, result_buffer) {
    console.log(err, result_string, result_buffer);
  });
});



var User = function(id, name, publicKey, privateKey, passphrase){
  this.name = name;
  this.passphrase = passphrase;
  this.id = id;
  this.privateKey = privateKey;
  this.publicKey = publicKey;

  /*
  data format:
  {
    messages: [{
        data: 'AES hex string',
        key: 'RSA encrypted AES key, null if not encrypted',
        iv: 'RSA encrypted AES iv, null if not encrypted',
        to: 'hash of the recipient's public key, null if visible to all'
    }],
    signature: ....
  }
   */
  this.data = Object.create(null);
};
var p = User.prototype = Object.create(User.prototype);

p.load = function(){
  var onload = function(value){
    if(!value)
      return null;

    this.id = value.id;
    this.privateKey = pki.decryptRsaPrivateKey(value.privateKeyPem, value.passphrase);
    this.publicKey = pki.publicKeyFromPem(value.publicKeyPem);
    this.name = value.name;
    this.passphrase = value.passphrase;
    this.data = JSON.parse(value.data);
  };
  return localforage.getItem('currentUser').then(onload.bind(this));
};

p.save = function(){
  return localforage.setItem('currentUser', {
    id: this.id,
    privateKeyPem: pki.encryptRsaPrivateKey(this.privateKey, this.passphrase),
    publicKeyPem: pki.publicKeyToPem(this.publicKey),
    name: this.name,
    passphrase: this.passphrase,
    data: JSON.stringify(this.data)
  });
};

p.push = function(){
  var data = {
    id: this.id,
    name: this.name,
    publicKeyPem: pki.publicKeyToPem(this.publicKey),
    data: this.data
  }

  return put('/api/users/'+this.id, data, {'Content-Type': 'application/json'});
};

/**
 * [commit description]
 * @param  {[type]} content      content to send
 * @param  {[type]} publicKey Recipient public key, for encryption use.
 */
p.commit = function(content, recipientPublicKey){
  // construct the encryption
  // create cipher for message
  var key = forge.random.getBytesSync(16);
  var iv = forge.random.getBytesSync(16);
  var cipher = forge.cipher.createCipher('AES-CBC', key);
  cipher.start({iv: iv});
  cipher.update(forge.util.createBuffer(content));
  cipher.finish();
  // do I need to turn it into hex? or just let JSON.stringify to encode bytes(probably won't work)?
  var data = cipher.output.toHex();

  // encrypt key and iv
  var message = { data: data };
  if(recipientPublicKey){
    message.key = forge.util.bytesToHex(recipientPublicKey.encrypt(key));
    message.iv = forge.util.bytesToHex(recipientPublicKey.encrypt(iv));
    message.encrypted = true;
  }
  else{
    message.key = forge.util.bytesToHex(key);
    message.iv = forge.util.bytesToHex(iv);
    message.encrypted = false;
  }

  // add the new message to the message array
  this.data.messages = this.data.messages ? this.data.messages : [];
  this.data.messages.push(message);

  // sign the new message content, update the old signature
  var md = forge.md.sha1.create();
  md.update(JSON.stringify(this.data.messages), 'utf8');
  this.data.signature = forge.util.bytesToHex(this.privateKey.sign(md));

  this.save();
};

p.fingerprint = function(){
  console.log(pki.getPublicKeyFingerprint(this.publicKey, {encoding: 'hex'}));
};

Object.defineProperty(p, 'publicKeyPem', {
  get: function() {
    return pki.publicKeyToPem(this.publicKey);
  }
});

User.create = function(name, passphrase){
  var keypair = rsa.generateKeyPair({bits: 1024, e: 0x10001});
  var privateKey = keypair.privateKey;
  var publicKey = keypair.publicKey;

  return post('/api/users', {
    name: name,
    publicKeyPem: pki.publicKeyToPem(publicKey)
  }, {'Content-Type': 'application/json'}).then(function(data){
    User.currentUser = new User(JSON.parse(data)._id, name, publicKey, privateKey, passphrase);
    return User.currentUser.save();
  });
};

User.convertServerModel = function(model){
  var publicKey = pki.publicKeyFromPem(model.publicKeyPem);
  var user = new User(model._id, model.name, publicKey);
  if(model.data){
    user.data = JSON.parse(model.data);
  }
  return user;
};

// TODO: have to obtain friend's public key instead of depends on server returned public key.
// May be hash other people's public key for searching?!
User.verify = function(user){
  if(user.data && user.data.signature){
    console.log(user.data);
    var md2 = forge.md.sha1.create();
    md2.update(JSON.stringify(user.data.messages), 'utf8');
    return user.publicKey.verify(md2.digest().bytes(), forge.util.hexToBytes(user.data.signature));
  }
  else{
    return true;
  }
};

User.currentUser = new User();
User.currentUser.load().then(function(){
  User.currentUser.fingerprint();
});